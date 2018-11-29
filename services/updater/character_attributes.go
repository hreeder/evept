package updater

import "sync"

// UpdateCharacterAttributes will update the character with data from the characters/{character_id}/attributes/ endpoint
func (u *CharacterUpdater) UpdateCharacterAttributes(wg *sync.WaitGroup) error {
	characterID := u.character.ID()
	attributes, _, err := u.esi.ESI.SkillsApi.GetCharactersCharacterIdAttributes(
		u.getAuthContext(),
		characterID,
		nil,
	)
	if err != nil {
		return err
	}

	// Attributes
	u.character.Attributes.Charisma = attributes.Charisma
	u.character.Attributes.Intelligence = attributes.Intelligence
	u.character.Attributes.Memory = attributes.Memory
	u.character.Attributes.Perception = attributes.Perception
	u.character.Attributes.Willpower = attributes.Willpower

	// Remap info
	u.character.Attributes.AccruedRemapCooldownDate = attributes.AccruedRemapCooldownDate
	u.character.Attributes.BonusRemaps = attributes.BonusRemaps
	u.character.Attributes.LastRemapDate = attributes.LastRemapDate

	wg.Done()
	return nil
}
