package shared

import (
	"os"
	"strconv"
	"time"

	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/guregu/dynamo"
)

// Character represents a character in DynamoDB
type Character struct {
	ResourceType      string `dynamo:"resourceType,hash"`
	ResouceIdentifier string `dynamo:"resourceIdentifier,range"`

	RefreshToken string `dynamo:"refresh_token"`

	CharacterName string    `dynamo:"characterName"`
	CharacterID   string    `dynamo:"characterId"`
	UpdatedAt     time.Time `dynamo:"updated_at"`

	SecurityStatus float32 `dynamo:"security_status"`
	TotalSp        int64   `dynamo:"total_sp"`
	UnallocatedSp  int32   `dynamo:"unallocated_sp"`

	Corporation CharacterCorporation `dynamo:"corporation"`
	Alliance    CharacterAlliance    `dynamo:"alliance"`

	Attributes CharacterAttributes        `dynamo:"attributes"`
	Skills     []CharacterSkill           `dynamo:"skills"`
	Skillqueue []CharacterSkillqueueEntry `dynamo:"skillqueue"`
}

// CharacterFromDynamo will get the character object from DynamoDB
func CharacterFromDynamo(awsSession *session.Session, resourceType, resourceIdentifier string) (*Character, error) {
	db := dynamo.New(awsSession)
	table := db.Table(os.Getenv("DYNAMO_TABLE_NAME"))

	var result Character
	err := table.Get("resourceType", resourceType).
		Range("resourceIdentifier", dynamo.Equal, resourceIdentifier).
		One(&result)

	if err != nil {
		return nil, err
	}

	return &result, nil
}

// ID will return the CharacterID in int32 format
func (c Character) ID() int32 {
	characterID, _ := strconv.ParseInt(c.CharacterID, 10, 32)
	return int32(characterID)
}

// Save writes this character to DynamoDB
func (c *Character) Save(awsSession *session.Session) error {
	db := dynamo.New(awsSession)
	table := db.Table(os.Getenv("DYNAMO_TABLE_NAME"))

	return table.Put(c).Run()
}
