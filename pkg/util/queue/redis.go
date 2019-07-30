package queue

import (
	"fmt"

	"github.com/go-redis/redis"
)

// RedisClusterOptions returns the redis.ClusterOptions object ready to be used
func (c *Config) RedisClusterOptions() *redis.ClusterOptions {
	return &redis.ClusterOptions{
		Addrs: []string{fmt.Sprintf("%v:6379", c.Host)},
	}
}