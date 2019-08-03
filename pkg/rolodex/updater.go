package rolodex

import (
	"context"
	"sync"
	"time"

	"github.com/antihax/goesi"
	"github.com/juju/loggo"

	evept "github.com/hreeder/evept/pkg/shared"
	"github.com/hreeder/evept/pkg/util/common"
	"github.com/hreeder/evept/pkg/util/db"
	"github.com/hreeder/evept/pkg/util/eveesi"
)

// Updater is the main updater "object"
type Updater struct {
	// Utils
	db     *db.Config
	esi    *eveesi.Config
	logger loggo.Logger

	// Resource
	character *evept.Character
}

// NewUpdater returns a new CharacterUpdater object
func NewUpdater(characterID string, logger loggo.Logger) (*Updater, error) {
	DB := common.GetDBConfig()
	ESI := common.GetESIConfig()

	logger.Debugf("Getting character from DB")
	character, err := evept.CharacterFromDB(DB.Get(), characterID)
	if err != nil {
		return nil, err
	}

	logger.Debugf("Returning Updater Object")
	return &Updater{
		esi:    ESI,
		db:     DB,
		logger: logger,

		character: character,
	}, nil
}

func (u *Updater) getAuthContext() context.Context {
	tokenSource := u.esi.GetTokenSource(u.character.RefreshToken)
	return context.WithValue(context.Background(), goesi.ContextOAuth2, tokenSource)
}

// Run will start the character update action
func (u *Updater) Run(outerWg *sync.WaitGroup) error {
	u.logger.Infof("Updating %s (%d)", u.character.CharacterName, u.character.CharacterID)

	tx := u.db.Get().MustBegin()
	var wg sync.WaitGroup
	wg.Add(4)

	go u.UpdateCharacterInfo(&wg)
	go u.UpdateCharacterAttributes(&wg, tx)
	go u.UpdateCharacterSkills(&wg, tx)
	go u.UpdateCharacterSkillqueue(&wg, tx)

	u.character.LastUpdated.Time = time.Now().UTC()
	u.character.LastUpdated.Valid = true

	wg.Wait()

	u.logger.Debugf("Done Updating %s (%d). Proceeding to save", u.character.CharacterName, u.character.CharacterID)
	err := u.character.Save(tx)
	tx.Commit()
	if err != nil {
		u.logger.Warningf("CharacterUpdater:%s:%d: UNABLE TO SAVE", u.character.CharacterName, u.character.CharacterID)
		u.logger.Warningf(err.Error())
		return err
	}

	u.logger.Infof("Completed Update for %s (%d)", u.character.CharacterName, u.character.CharacterID)

	outerWg.Done()
	return nil
}
