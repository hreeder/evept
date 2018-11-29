package shared

// CharacterSkill is a single skill that a character may have
type CharacterSkill struct {
	ActiveSkillLevel   int32 `dynamo:"active_skill_level"`
	SkillID            int32 `dynamo:"skill_id"`
	SkillpointsInSkill int64 `dynamo:"skillpoints_in_skill"`
	TrainedSkillLevel  int32 `dynamo:"trained_skill_level"`
}
