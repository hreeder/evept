package rolodex

import (
	"sync"

	"github.com/jmoiron/sqlx"

	evept "github.com/hreeder/evept/pkg/shared"
)

// UpdateCharacterAttributes will update the character with data from the characters/{character_id}/attributes/ endpoint
func (u *Updater) UpdateCharacterAttributes(wg *sync.WaitGroup, tx *sqlx.Tx) error {
	esi := u.esi.GetAPIClient()
	attributes, _, err := esi.ESI.SkillsApi.GetCharactersCharacterIdAttributes(
		u.getAuthContext(),
		u.character.CharacterID,
		nil,
	)
	if err != nil {
		wg.Done()
		return err
	}

	characterAttributes := &evept.CharacterAttributes{
		CharacterID: u.character.CharacterID,
		// Attributes
		Charisma:     attributes.Charisma,
		Intelligence: attributes.Intelligence,
		Memory:       attributes.Memory,
		Perception:   attributes.Perception,
		Willpower:    attributes.Willpower,

		// Remap info
		AccruedRemapCooldownDate: attributes.AccruedRemapCooldownDate,
		BonusRemaps:              attributes.BonusRemaps,
		LastRemapDate:            attributes.LastRemapDate,
	}

	characterAttributes.Save(tx)

	wg.Done()
	return nil
}
