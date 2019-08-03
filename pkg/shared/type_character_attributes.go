package shared

import (
	"time"

	"github.com/jmoiron/sqlx"
)

// CharacterAttributes holds the character's attribute points
type CharacterAttributes struct {
	CharacterID              int32     `db:"characterID"`
	Charisma                 int32     `db:"charisma"`
	Intelligence             int32     `db:"intelligence"`
	Memory                   int32     `db:"memory"`
	Perception               int32     `db:"perception"`
	Willpower                int32     `db:"willpower"`
	BonusRemaps              int32     `db:"bonusRemaps"`
	AccruedRemapCooldownDate time.Time `db:"accruedRemapCooldown"`
	LastRemapDate            time.Time `db:"lastRemapDate"`
}

// Save writes this to the database
func (ca *CharacterAttributes) Save(tx *sqlx.Tx) {
	tx.NamedExec(`INSERT INTO public."characterAttributes" (
		"characterID",
		"charisma",
		"intelligence",
		"memory",
		"perception",
		"willpower",
		"bonusRemaps",
		"accruedRemapCooldown",
		"lastRemapDate"
	) VALUES (
		:characterID,
		:charisma,
		:intelligence,
		:memory,
		:perception,
		:willpower,
		:bonusRemaps,
		:accruedRemapCooldown,
		:lastRemapDate
	)
	ON CONFLICT ("characterID") DO UPDATE SET
		"charisma" = excluded."charisma",
		"intelligence" = excluded."intelligence",
		"memory" = excluded."memory",
		"perception" = excluded."perception",
		"willpower" = excluded."willpower",
		"bonusRemaps" = excluded."bonusRemaps",
		"accruedRemapCooldown" = excluded."accruedRemapCooldown",
		"lastRemapDate" = excluded."lastRemapDate"`, ca)
}
