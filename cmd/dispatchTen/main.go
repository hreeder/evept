package main

import (
	"os"
	"strconv"

	"github.com/jmoiron/sqlx"
	"github.com/juju/loggo"

	evept "github.com/hreeder/evept/pkg/shared"
	"github.com/hreeder/evept/pkg/util/common"
	"github.com/hreeder/evept/pkg/util/queue"
)

func main() {
	logger := loggo.GetLogger("evept.dispatchTen")
	logLevel, _ := loggo.ParseLevel("INFO")
	if os.Getenv("EVEPT_DEBUG") != "" {
		logLevel, _ = loggo.ParseLevel("DEBUG")
	}
	logger.SetLogLevel(logLevel)

	logger.Infof("Running DispatchTen")

	queueConfig := common.GetQueueConfig(logger)
	dbConfig := common.GetDBConfig()

	db := dbConfig.Get()

	dispatchRolodexCharacterUpdates(logger, db, queueConfig)
	logger.Infof("Completed DispatchTen")
}

func dispatchRolodexCharacterUpdates(logger loggo.Logger, db *sqlx.DB, queue *queue.Config) {
	var count int
	err := db.Get(&count, "SELECT count(*) FROM characters;")
	if err != nil {
		logger.Warningf(err.Error())
	}

	characters := []evept.Character{}
	query := `SELECT * FROM public.characters
	WHERE "lastUpdated" < now()-'1 hour'::interval
	ORDER BY "lastUpdated" ASC`

	if count > 6 {
		query += `LIMIT `
		query += strconv.Itoa(count / 6)
	}
	err = db.Select(&characters, query)
	if err != nil {
		logger.Warningf(err.Error())
	}

	for _, character := range characters {
		queue.SubmitTask("rolodex:update", strconv.Itoa(int(character.CharacterID)))
	}
	logger.Infof("Queued %d characters in rolodex:update", len(characters))
}
