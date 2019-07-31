package queue

import (
	"fmt"
)

func getSubmissionQueue(name string) string {
	return fmt.Sprintf("tasks:%v:submitted", name)
}

func getWorkingQueueName(name string) string {
	return fmt.Sprintf("tasks:%v:working", name)
}

// SubmitTask submits a task to be worked on
func (c *Config) SubmitTask(queueName string, identifier string) {
	client := c.RedisClient()
	submissionQueue := getSubmissionQueue(queueName)
	c.Logger.Debugf("Submitting task to %v with identifier %v", submissionQueue, identifier)
	result := client.LPush(submissionQueue, identifier)
	c.Logger.Debugf("Submitted with return value %v", result)
}

// GetTask returns a task to be worked on
func (c *Config) GetTask(queueName string) (string, error) {
	client := c.RedisClient()
	submissionQueue := getSubmissionQueue(queueName)
	workingQueue := getWorkingQueueName(queueName)
	result := client.RPopLPush(submissionQueue, workingQueue)
	return result.Val(), result.Err()
}
