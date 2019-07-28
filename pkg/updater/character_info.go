package updater

import "sync"

// UpdateCharacterInfo will update the character with data from the characters/{character_id}/ endpoint
func (u *CharacterUpdater) UpdateCharacterInfo(wg *sync.WaitGroup) error {
	characterID := u.character.ID()
	characterInfo, _, err := u.esi.ESI.CharacterApi.GetCharactersCharacterId(
		u.getAuthContext(),
		characterID,
		nil,
	)
	if err != nil {
		return err
	}

	u.character.Corporation.CorporationID = characterInfo.CorporationId
	if characterInfo.AllianceId != 0 {
		u.character.Alliance.AllianceID = characterInfo.AllianceId
	}
	u.character.SecurityStatus = characterInfo.SecurityStatus

	wg.Done()

	return nil
}
