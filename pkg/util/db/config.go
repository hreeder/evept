package db

import (
	"fmt"
	"log"

	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

// Config represents the required entrypoint into the database
type Config struct {
	Username     string
	Password     string
	HostName     string
	DatabaseName string
	SchemaName   string
}

// DB returns a database session
func (config *Config) Get() *sqlx.DB {
	db, err := sqlx.Connect("postgres", fmt.Sprintf("dbname=%v user=%v password=%v host=%v sslmode=disable", config.DatabaseName, config.Username, config.Password, config.HostName))
	if err != nil {
		log.Fatalln(err)
	}

	return db
}
