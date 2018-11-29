package shared

import "strings"

// BatchUpdate represents a set of updates to be updated by the worker service
type BatchUpdate struct {
	Entries []EvePtPrimaryKey
}

// EvePtPrimaryKey represents a composite primary key used within DynamoDB
type EvePtPrimaryKey struct {
	ResourceType       string
	ResourceIdentifier string
}

// GetResourceType is used to get the actual resource type from our ResourceType string
func (pk EvePtPrimaryKey) GetResourceType() string {
	split := strings.Split(pk.ResourceType, ":")
	return split[len(split)-1]
}
