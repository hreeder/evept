package updater

import "time"

// CharacterAttributes holds the character's attribute points
type CharacterAttributes struct {
	AccruedRemapCooldownDate time.Time `dynamo:"accrued_remap_cooldown_date"`
	BonusRemaps              int32     `dynamo:"bonus_remaps"`
	Charisma                 int32     `dynamo:"charisma"`
	Intelligence             int32     `dynamo:"intelligence"`
	LastRemapDate            time.Time `dynamo:"last_remap_date"`
	Memory                   int32     `dynamo:"memory"`
	Perception               int32     `dynamo:"perception"`
	Willpower                int32     `dynamo:"willpower"`
}
