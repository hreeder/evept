package shared

import (
	"database/sql"

	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"
)

// Character represents a character in the database
type Character struct {
	CharacterID   int32  `db:"characterID"`
	CharacterName string `db:"characterName"`
	Owner         string `db:"owner"`
	RefreshToken  string `db:"refreshToken"`

	LastUpdated pq.NullTime `db:"lastUpdated"`

	CorporationID  sql.NullInt64   `db:"corporationID"`
	SecurityStatus sql.NullFloat64 `db:"securityStatus"`
	TotalSp        sql.NullInt64   `db:"totalSkillpoints"`
	UnallocatedSp  sql.NullInt64   `db:"unallocatedSkillpoints"`
}

// CharacterFromDB will get the character object from the DB
func CharacterFromDB(db *sqlx.DB, characterID string) (*Character, error) {
	character := Character{}
	err := db.Get(&character, `SELECT * FROM public.characters WHERE "characterID"=$1`, characterID)

	return &character, err
}

// Save writes this character to the database
func (c *Character) Save(tx *sqlx.Tx) error {
	_, err := tx.NamedExec(`UPDATE public.characters SET
	"characterName"=:characterName,
	"refreshToken"=:refreshToken,
	"lastUpdated"=:lastUpdated,
	"corporationID"=:corporationID,
	"securityStatus"=:securityStatus,
	"totalSkillpoints"=:totalSkillpoints,
	"unallocatedSkillpoints"=:unallocatedSkillpoints
	WHERE "characterID"=:characterID`, c)

	return err
}
