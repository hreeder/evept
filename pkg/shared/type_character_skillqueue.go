package shared

import "time"

// CharacterSkillqueueEntry is a single skill in the queue that a character may have
type CharacterSkillqueueEntry struct {
	FinishDate      time.Time `dynamo:"finish_date"`
	FinishedLevel   int32     `dynamo:"finished_level"`
	LevelEndSp      int32     `dynamo:"level_end_sp"`
	LevelStartSp    int32     `dynamo:"level_start_sp"`
	QueuePosition   int32     `dynamo:"queue_position"`
	SkillID         int32     `dynamo:"skill_id"`
	StartDate       time.Time `dynamo:"start_date"`
	TrainingStartSp int32     `dynamo:"training_start_sp"`
}
