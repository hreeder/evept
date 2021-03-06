package shared

import (
	"database/sql"

	"github.com/jmoiron/sqlx"
)

// CharacterSkill is a single skill that a character may have
type CharacterSkill struct {
	CharacterID        int32 `db:"characterID" json:"-"`
	SkillID            int32 `db:"skillID" json:"skill_id"`
	SkillpointsInSkill int64 `db:"skillpointsInSkill" json:"skillpoints_in_skill"`
	TrainedSkillLevel  int32 `db:"trainedSkillLevel" json:"trained_skill_level"`
	ActiveSkillLevel   int32 `db:"activeSkillLevel" json:"active_skill_level"`
}

// Save writes this to the database
func (cs *CharacterSkill) Save(tx *sqlx.Tx) (sql.Result, error) {
	return tx.NamedExec(`INSERT INTO public."characterSkills" (
		"characterID",
		"skillID",
		"skillpointsInSkill",
		"trainedSkillLevel",
		"activeSkillLevel"
	) VALUES (
		:characterID,
		:skillID,
		:skillpointsInSkill,
		:trainedSkillLevel,
		:activeSkillLevel
	)
	ON CONFLICT ("characterID", "skillID") DO UPDATE SET
		"characterID" = excluded."characterID",
		"skillID" = excluded."skillID",
		"skillpointsInSkill" = excluded."skillpointsInSkill",
		"trainedSkillLevel" = excluded."trainedSkillLevel",
		"activeSkillLevel" = excluded."activeSkillLevel"`, cs)
}
