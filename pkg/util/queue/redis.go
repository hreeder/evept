package queue

import (
	"fmt"

	"github.com/go-redis/redis"
)

// RedisClient returns the redis.ClusterClient object ready to be used
func (c *Config) RedisClient() redis.UniversalClient {
	return redis.NewUniversalClient(&redis.UniversalOptions{
		Addrs: []string{fmt.Sprintf("%v:6379", c.Host)},
	})
}
