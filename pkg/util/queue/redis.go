package queue

import (
	"strings"

	"github.com/go-redis/redis"
)

// RedisClient returns the redis.ClusterClient object ready to be used
func (c *Config) RedisClient() redis.UniversalClient {
	if c.Cluster != "" {
		return redis.NewClusterClient(&redis.ClusterOptions{
			Addrs: strings.Split(c.Host, ","),
		})
	}
	return redis.NewClient({
		Addr: c.Host, ",",
	})
}
