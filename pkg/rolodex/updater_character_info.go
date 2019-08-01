package rolodex

import "sync"

// UpdateCharacterInfo will update the character with data from the characters/{character_id}/ endpoint
func (u *Updater) UpdateCharacterInfo(wg *sync.WaitGroup) error {
	u.logger.Debugf("Beginning UpdateCharacterInfo for %s(%d)", u.character.CharacterName, u.character.CharacterID)
	esi := u.esi.GetAPIClient()
	u.logger.Debugf("UpdateCharacterInfo: Obtained ESIClient")

	characterInfo, _, err := esi.ESI.CharacterApi.GetCharactersCharacterId(
		u.getAuthContext(),
		u.character.CharacterID,
		nil,
	)
	if err != nil {
		u.logger.Warningf(err.Error())
		wg.Done() // Without this, we never exit
		return err
	}
	u.logger.Debugf("UpdateCharacterInfo: Got Character Info")

	u.character.CorporationID.Int64 = int64(characterInfo.CorporationId)
	u.character.CorporationID.Valid = true
	u.character.SecurityStatus.Float64 = float64(characterInfo.SecurityStatus)
	u.character.SecurityStatus.Valid = true
	u.logger.Debugf("UpdateCharacterInfo: Assigned Values")

	wg.Done()
	u.logger.Debugf("UpdateCharacterInfo: Done")

	return nil
}
