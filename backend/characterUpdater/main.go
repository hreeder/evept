package main

import (
	"context"
	"encoding/json"
	"log"
	"strings"
	"sync"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/hreeder/evept-characterUpdater/updater"
)

type batchUpdate struct {
	Entries	[]evePtPrimaryKey
}

type evePtPrimaryKey struct {
	ResourceType       string
	ResourceIdentifier string
}

func (pk evePtPrimaryKey) GetResourceType() string {
	split := strings.Split(pk.ResourceType, ":")
	return split[len(split)-1]
}

func handler(ctx context.Context, sqsEvent events.SQSEvent) error {
	awsSession := session.New()
	var wg sync.WaitGroup

	for _, message := range sqsEvent.Records {
		var updateRequest batchUpdate
		json.Unmarshal([]byte(message.Body), &updateRequest)

		for _, entry := range updateRequest.Entries {
			switch entry.GetResourceType() {
			case "character":
				updater, err := updater.New(entry.ResourceType, entry.ResourceIdentifier, awsSession)
				if (err != nil) {
					log.Println(err)
					continue
				}
				wg.Add(1)
				go updater.Run(&wg)
				if (err != nil) {
					log.Println(err)
					continue
				}
			default:
				log.Printf("Unable to trigger Update")
			}
		}
	}

	wg.Wait()

	return nil
}

func main() {
	lambda.Start(handler)
}
