package rolodex

import (
	"sync"

	"github.com/jmoiron/sqlx"

	evept "github.com/hreeder/evept/pkg/shared"
)

// UpdateCharacterSkills will update the character with data from the characters/{character_id}/skills endpoint
func (u *Updater) UpdateCharacterSkills(wg *sync.WaitGroup, tx *sqlx.Tx) error {
	u.logger.Debugf("Updating Character Skills")
	esi := u.esi.GetAPIClient()
	skills, _, err := esi.ESI.SkillsApi.GetCharactersCharacterIdSkills(
		u.getAuthContext(),
		u.character.CharacterID,
		nil,
	)
	if err != nil {
		u.logger.Warningf(err.Error())
		wg.Done()
		return err
	}

	u.logger.Debugf("Setting data back to Character")
	u.character.TotalSp.Int64 = skills.TotalSp
	u.character.TotalSp.Valid = true
	u.character.UnallocatedSp.Int64 = int64(skills.UnallocatedSp)
	u.character.UnallocatedSp.Valid = true

	numToProcess := len(skills.Skills)
	u.logger.Debugf("Processing %d skills", numToProcess)
	for _, skill := range skills.Skills {
		charSkill := &evept.CharacterSkill{
			CharacterID:        u.character.CharacterID,
			SkillID:            skill.SkillId,
			ActiveSkillLevel:   skill.ActiveSkillLevel,
			SkillpointsInSkill: skill.SkillpointsInSkill,
			TrainedSkillLevel:  skill.TrainedSkillLevel,
		}
		_, err := charSkill.Save(tx)
		if err != nil {
			u.logger.Warningf(err.Error())
		}
	}
	u.logger.Debugf("Skills processed")

	wg.Done()

	return nil
}
