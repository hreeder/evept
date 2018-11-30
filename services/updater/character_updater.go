package updater

import (
	"context"
	"log"
	"os"
	"net/http"
	"sync"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/ssm"
	"github.com/antihax/goesi"
	"golang.org/x/oauth2"

	evept "github.com/hreeder/evept/services/shared"
)

// CharacterUpdater is the main updater "object"
type CharacterUpdater struct {
	// AWS
	awsSession *session.Session

	// goesi client
	esi *goesi.APIClient

	// Authentication
	token     *oauth2.TokenSource
	tokenAuth *goesi.SSOAuthenticator

	// Resource
	character *evept.Character
}

// New returns a new CharacterUpdater object
func New(resourceType, resourceID string, awsSession *session.Session) (*CharacterUpdater, error) {
	character, err := evept.CharacterFromDynamo(awsSession, resourceType, resourceID)

	if err != nil {
		return nil, err
	}

	httpClient := &http.Client{}
	
	esiClient := goesi.NewAPIClient(httpClient, "evePT/characterUpdater - ingame: Sklullus Dromulus - @sklullus on Tweetfleet Slack")

	ssmSvc := ssm.New(awsSession)
	secrets, err := ssmSvc.GetParameters(&ssm.GetParametersInput{
		Names: aws.StringSlice([]string{os.Getenv("ESI_CLIENTID"), os.Getenv("ESI_SECRET")}),
		WithDecryption: aws.Bool(true),
	})

	if err != nil {
		return nil, err
	}
	
	esiClientID := *secrets.Parameters[0].Value
	esiClientSecret := *secrets.Parameters[1].Value
	
	// The last two args are redirectURL and scopes
	// We leave them empty because we don't directly use them, yet we must specify them
	auth := goesi.NewSSOAuthenticatorV2(httpClient, esiClientID, esiClientSecret, "", []string{})
	token := auth.TokenSource(&oauth2.Token{
		Expiry: time.Now(),
		AccessToken: "",
		RefreshToken: character.RefreshToken,
		TokenType: "Bearer",
	})

	return &CharacterUpdater{
		awsSession: awsSession,

		esi: esiClient,

		token: &token,
		tokenAuth: auth,

		character: character,
	}, nil
}

func (u *CharacterUpdater) getAuthContext() context.Context {
	return context.WithValue(context.Background(), goesi.ContextOAuth2, *u.token)
}

// Run will start the character update action
func (u *CharacterUpdater) Run(outerWg *sync.WaitGroup) error {
	log.Printf("CharacterUpdater:%s:%s: Updating\n", u.character.CharacterName, u.character.CharacterID)

	var wg sync.WaitGroup
	wg.Add(4)

	go u.UpdateCharacterInfo(&wg)
	go u.UpdateCharacterAttributes(&wg)
	go u.UpdateCharacterSkills(&wg)
	go u.UpdateCharacterSkillqueue(&wg)
	u.character.UpdatedAt = time.Now().UTC()

	wg.Wait()
	log.Printf("CharacterUpdater:%s:%s: Done\n", u.character.CharacterName, u.character.CharacterID)
	err := u.character.Save(u.awsSession)
	if err != nil {
		log.Printf("CharacterUpdater:%s:%s: UNABLE TO SAVE", u.character.CharacterName, u.character.CharacterID)
		log.Fatal(err)
		return err
	}
	
	outerWg.Done()
	return nil
}
