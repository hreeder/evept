package updater

import (
	"sync"

	evept "github.com/hreeder/evept/services/shared"
)

// UpdateCharacterSkills will update the character with data from the characters/{character_id}/skills endpoint
func (u *CharacterUpdater) UpdateCharacterSkills(wg *sync.WaitGroup) error {
	characterID := u.character.ID()
	skills, _, err := u.esi.ESI.SkillsApi.GetCharactersCharacterIdSkills(
		u.getAuthContext(),
		characterID,
		nil,
	)
	if err != nil {
		return err
	}

	u.character.TotalSp = skills.TotalSp
	u.character.UnallocatedSp = skills.UnallocatedSp
	u.character.Skills = []evept.CharacterSkill{}

	for _, skill := range skills.Skills {
		u.character.Skills = append(u.character.Skills, evept.CharacterSkill{
			ActiveSkillLevel:   skill.ActiveSkillLevel,
			SkillID:            skill.SkillId,
			SkillpointsInSkill: skill.SkillpointsInSkill,
			TrainedSkillLevel:  skill.TrainedSkillLevel,
		})
	}

	wg.Done()

	return nil
}

// UpdateCharacterSkillqueue will update the character with data from the characters/{character_id}/skillqueue endpoint
func (u *CharacterUpdater) UpdateCharacterSkillqueue(wg *sync.WaitGroup) error {
	characterID := u.character.ID()
	queue, _, err := u.esi.ESI.SkillsApi.GetCharactersCharacterIdSkillqueue(
		u.getAuthContext(),
		characterID,
		nil,
	)
	if err != nil {
		return err
	}

	u.character.Skillqueue = []evept.CharacterSkillqueueEntry{}

	for _, skill := range queue {
		u.character.Skillqueue = append(u.character.Skillqueue, evept.CharacterSkillqueueEntry{
			FinishDate:      skill.FinishDate,
			FinishedLevel:   skill.FinishedLevel,
			LevelEndSp:      skill.LevelEndSp,
			LevelStartSp:    skill.LevelStartSp,
			QueuePosition:   skill.QueuePosition,
			SkillID:         skill.SkillId,
			StartDate:       skill.StartDate,
			TrainingStartSp: skill.TrainingStartSp,
		})
	}

	wg.Done()

	return nil
}
