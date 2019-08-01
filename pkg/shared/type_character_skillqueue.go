package shared

import (
	"database/sql"
	"time"

	"github.com/jmoiron/sqlx"
)

// CharacterSkillqueueEntry is a single skill in the queue that a character may have
type CharacterSkillqueueEntry struct {
	CharacterID     int32     `db:"characterID"`
	SkillID         int32     `db:"skillID"`
	QueuePosition   int32     `db:"queuePosition"`
	StartDate       time.Time `db:"startDate"`
	FinishDate      time.Time `db:"finishDate"`
	FinishedLevel   int32     `db:"finishedLevel"`
	TrainingStartSp int32     `db:"trainingStartSP"`
	LevelStartSp    int32     `db:"levelStartSP"`
	LevelEndSp      int32     `db:"levelEndSP"`
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
