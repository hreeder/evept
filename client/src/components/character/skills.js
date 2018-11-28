import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import SkillGroup from './skills-group'
import PageHeading from '../pageheading'

import './styles.css'

class CharacterSkills extends Component {
  render() {
    let character = null
    this.props.characters.characters.forEach(_character => {
      if (parseInt(_character.characterId) === parseInt(this.props.match.params.charid)) {
        character = _character
      }
    })

    const characterSkillsById = {}
    character.getSkills().forEach(skill => characterSkillsById[skill.skill_id] = skill)

    const groups = []
    Object.keys(this.props.sde.groupIDs).forEach(key => {
      const item = this.props.sde.groupIDs[key]
      if (item.categoryID !== 16) return                // Category 16 is 'Skill'
      groups.push({
        "groupID": parseInt(key),
        "name": item.name
      })
    })

    return (
      <div>
        <PageHeading title={character.characterName} subHeading="Skills" />
        {groups.map(group => <SkillGroup characterSkills={characterSkillsById} group={group} key={group.groupID} />)}
      </div>
    )
  }
}

export default connect(store => {
  return {
    characters: store.characters,
    sde: store.sde
  }
}, dispatch => bindActionCreators({
  
}, dispatch))(CharacterSkills)