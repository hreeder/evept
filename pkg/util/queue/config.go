package queue

import "github.com/juju/loggo"

// Config represents the Redis configuration necessary
type Config struct {
	Host    string
	Cluster string
	Logger  loggo.Logger
}
