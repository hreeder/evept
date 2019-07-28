package shared

// CharacterCorporation handles the detail for holding what corporation a character is in
type CharacterCorporation struct {
	CorporationID int32 `dynamo:"corporationId"`
}

// CharacterAlliance handles the detail for holding what alliance a character is in
type CharacterAlliance struct {
	AllianceID int32 `dynamo:"allianceId"`
}
