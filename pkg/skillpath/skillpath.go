package skillpath

import "github.com/hreeder/evept/util/db"

// SkillPath is our generic struct we attach funcs to
type SkillPath struct {
	DB *db.Config
}

// GetSkillPath does the thing
func GetSkillPath(db *db.Config) *SkillPath {
	return &SkillPath{
		DB: db,
	}
}
