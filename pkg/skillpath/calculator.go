package skillpath

import "fmt"

type Item struct {
	TypeID  int    `db:"typeID"`
	GroupID int    `db:"groupID"`
	Name    string `db:"typeName"`
}

// GetFrom does the thing
func (sp *SkillPath) GetFrom(origin int64) {
	db := sp.DB.Get()

	items := []Item{}
	err := db.Select(&items, `SELECT "typeID", "groupID", "typeName" FROM evesde."invTypes"`)
	if err != nil {
		panic(err)
	}
	fmt.Printf("Length of items: %d\n", len(items))
	for _, item := range items {
		fmt.Printf("ItemID: %d\tGroupID: %d\tName: %v\n", item.TypeID, item.GroupID, item.Name)
	}
}
