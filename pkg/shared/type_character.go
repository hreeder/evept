package shared

import (
	"database/sql"

	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"
)

// Character represents a character in the database
type Character struct {
	CharacterID   int32  `db:"characterID" json:"characterId"`
	CharacterName string `db:"characterName" json:"characterName"`
	Owner         string `db:"owner" json:"-"`
	RefreshToken  string `db:"refreshToken" json:"-"`

	LastUpdated pq.NullTime `db:"lastUpdated" json:"last_updated"`

	CorporationID  sql.NullInt64   `db:"corporationID" json:"corporationId"`
	SecurityStatus sql.NullFloat64 `db:"securityStatus" json:"securityStatus"`
	TotalSp        sql.NullInt64   `db:"totalSkillpoints" json:"totalSkillpoints"`
	UnallocatedSp  sql.NullInt64   `db:"unallocatedSkillpoints" json:"unallocatedSkillpoints"`
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
