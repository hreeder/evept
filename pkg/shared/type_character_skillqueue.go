package shared

import (
	"database/sql"
	"time"

	"github.com/jmoiron/sqlx"
)

// CharacterSkillqueueEntry is a single skill in the queue that a character may have
type CharacterSkillqueueEntry struct {
	CharacterID     int32     `db:"characterID" json:"-"`
	SkillID         int32     `db:"skillID" json:"skill_id"`
	QueuePosition   int32     `db:"queuePosition" json:"queue_position"`
	StartDate       time.Time `db:"startDate" json:"start_date"`
	FinishDate      time.Time `db:"finishDate" json:"finish_date"`
	FinishedLevel   int32     `db:"finishedLevel" json:"finished_level"`
	TrainingStartSp int32     `db:"trainingStartSP" json:"training_start_sp"`
	LevelStartSp    int32     `db:"levelStartSP" json:"level_start_sp"`
	LevelEndSp      int32     `db:"levelEndSP" json:"level_end_sp"`
}

// Save writes this to the DB
func (csqe *CharacterSkillqueueEntry) Save(tx *sqlx.Tx) (sql.Result, error) {
	return tx.NamedExec(`INSERT INTO public."characterSkillQueue" (
		"characterID",
		"skillID",
		"queuePosition",
		"startDate",
		"finishDate",
		"finishedLevel",
		"trainingStartSP",
		"levelStartSP",
		"levelEndSP"
	) VALUES (
		:characterID,
		:skillID,
		:queuePosition,
		:startDate,
		:finishDate,
		:finishedLevel,
		:trainingStartSP,
		:levelStartSP,
		:levelEndSP
	)`, csqe)
}
