import simplejson as json
import sys

from datetime import datetime, timedelta
from decimal import Decimal
from multiprocessing import Process, Pipe
from aws_xray_sdk.core import xray_recorder
from aws_xray_sdk.core import patch

from evept.util.db import get_table
from evept.util.esi import get_esi_client, SCOPES

patch(['boto3', 'requests'])

def update_character_sns(evt, ctxt):
    print('update_character_sns begins')
    print(evt)


def update_character(evt, ctxt):
    print('update_character begins')
    print(evt)

    processes = []

    get_esi_client()

    for record in evt['Records']:
        body = json.loads(record['body'])
        for character in body['characters']:
            process = Process(target=_update_character, args=(character,))
            processes.append(process)
    
    for process in processes:
        process.start()
    
    for process in processes:
        process.join()

    print('update_character ends')

def _update_character(item):
    xray_recorder.begin_subsegment('setup')
    table = get_table()
    doc = table.get_item(Key=item)['Item']
    charID = int(doc['characterId'])
    print(f"_update_character:{charID}:{doc['characterName']} begins")

    now = datetime.utcnow()
    last_updated = datetime.strptime(doc['updated_at'], "%Y-%m-%dT%H:%M:%S.%f")
    time_since_last_update = now - last_updated
    xray_recorder.end_subsegment()
    
    xray_recorder.begin_subsegment('get_esi_client')
    sec, app, client = get_esi_client()
    xray_recorder.end_subsegment()

    with xray_recorder.in_subsegment('token_refresh') as subsegment:
        sec.update_token({
            "access_token": "",
            "expires_in": -1,
            "refresh_token": doc['refresh_token']
        })
        new_tokens = sec.refresh()
        doc['refresh_token'] = new_tokens['refresh_token']

    # Character Info    - every 6h
    # if time_since_last_update > timedelta(hours=6):
    with xray_recorder.in_subsegment('character_info') as subsegment:
        op = app.op['get_characters_character_id'](
            character_id=charID
        )
        character_info = client.request(op).data
        doc['security_status'] = Decimal(str(character_info['security_status']))

        # Corp Details
        if "corporation" not in doc:
            doc['corporation'] = {}
        
        doc['corporation']['corporationId'] = character_info['corporation_id']
        
        # Alliance Details
        if "alliance" not in doc:
            doc['alliance'] = {}
        
        if "alliance_id" in character_info:
            doc['alliance']['allianceId'] = character_info['alliance_id']
    
    # Attributes    - Every 12h
    # if time_since_last_update > timedelta(hours=12):
    with xray_recorder.in_subsegment('character_attributes') as subsegment:
        op = app.op['get_characters_character_id_attributes'](
            character_id=charID
        )
        character_attributes = client.request(op).data

        if "attributes" not in doc:
            doc['attributes'] = {}
        
        if "accrued_remap_cooldown_date" in character_attributes:
            doc['attributes']['accrued_remap_cooldown_date'] = character_attributes['accrued_remap_cooldown_date'].to_json()
        if "last_remap_date" in character_attributes:
            doc['attributes']['last_remap_date'] = character_attributes['last_remap_date'].to_json()
        if "bonus_remaps" in character_attributes:
            doc['attributes']['bonus_remaps'] = character_attributes['bonus_remaps']

        doc['attributes']['charisma'] = character_attributes['charisma']
        doc['attributes']['intelligence'] = character_attributes['intelligence']
        doc['attributes']['memory'] = character_attributes['memory']
        doc['attributes']['perception'] = character_attributes['perception']
        doc['attributes']['willpower'] = character_attributes['willpower']

    # Skills
    with xray_recorder.in_subsegment('skills') as subsegment:
        op = app.op['get_characters_character_id_skills'](
            character_id=charID
        )
        character_skills = client.request(op).data

        doc['skills'] = [{
            'active_skill_level': skill['active_skill_level'],
            'skill_id': skill['skill_id'],
            'skillpoints_in_skill': skill['skillpoints_in_skill'],
            'trained_skill_level': skill['trained_skill_level']
        } for skill in character_skills['skills']]              # <-- This is a list comprehension because we're unable to deep copy
        doc['total_sp'] = character_skills['total_sp']          # the dictionaries in the original list from pyswagger for some reason
        doc['unallocated_sp'] = character_skills.get('unallocated_sp', 0)

    # Skill in training
    with xray_recorder.in_subsegment('skillqueue') as subsegment:
        op = app.op['get_characters_character_id_skillqueue'](
            character_id=charID
        )
        character_skillqueue = client.request(op).data

        doc['skillqueue'] = [{
            'finish_date': entry['finish_date'].to_json() if "finish_date" in entry else None,
            'finished_level': entry['finished_level'],
            'level_end_sp': entry['level_end_sp'],
            'level_start_sp': entry['level_start_sp'],
            'queue_position': entry['queue_position'],
            'skill_id': entry['skill_id'],
            'start_date': entry['start_date'].to_json() if "start_date" in entry else None,
            'training_start_sp': entry['training_start_sp']
        } for entry in character_skillqueue]

    # Save to DB
    doc['updated_at'] = now.isoformat()
    table.put_item(Item=doc)

    print(f"_update_character:{doc['characterId']}:{doc['characterName']} ends")
