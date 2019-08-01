package rolodex

import (
	"sync"

	"github.com/jmoiron/sqlx"

	evept "github.com/hreeder/evept/pkg/shared"
)

// UpdateCharacterSkillqueue will update the character with data from the characters/{character_id}/skillqueue endpoint
func (u *Updater) UpdateCharacterSkillqueue(wg *sync.WaitGroup, tx *sqlx.Tx) error {
	esi := u.esi.GetAPIClient()
	queue, _, err := esi.ESI.SkillsApi.GetCharactersCharacterIdSkillqueue(
		u.getAuthContext(),
		u.character.CharacterID,
		nil,
	)
	if err != nil {
		wg.Done()
		return err
	}

	tx.NamedExec(`DELETE FROM public."characterSkillQueue"
	WHERE "characterID"=:characterID`, u.character)

	u.logger.Debugf("Number of queue entries to update: %d", len(queue))

	for _, skill := range queue {
		queueEntry := &evept.CharacterSkillqueueEntry{
			CharacterID:     u.character.CharacterID,
			SkillID:         skill.SkillId,
			QueuePosition:   skill.QueuePosition,
			StartDate:       skill.StartDate,
			FinishDate:      skill.FinishDate,
			FinishedLevel:   skill.FinishedLevel,
			TrainingStartSp: skill.TrainingStartSp,
			LevelStartSp:    skill.LevelStartSp,
			LevelEndSp:      skill.LevelEndSp,
		}

		_, err := queueEntry.Save(tx)
		if err != nil {
			u.logger.Warningf(err.Error())
		}
	}

	u.logger.Debugf("Skill Queue Processed")

	wg.Done()

	return nil
}
