package main

import (
	"os"
	"strconv"
	"sync"

	"github.com/juju/loggo"

	"github.com/hreeder/evept/pkg/rolodex"
	"github.com/hreeder/evept/pkg/util/common"
)

type workingOn struct {
	QueueName  string
	Identifier string
}

func main() {
	logger := loggo.GetLogger("evept.rolodex.characterUpdater")
	logLevel, _ := loggo.ParseLevel("INFO")
	if os.Getenv("EVEPT_DEBUG") != "" {
		logLevel, _ = loggo.ParseLevel("DEBUG")
	}
	logger.SetLogLevel(logLevel)

	maxPerBatchEnvVar := os.Getenv("EVEPT_MAX_PER_BATCH")
	var maxPerBatch int
	if maxPerBatchEnvVar != "" {
		res, err := strconv.Atoi(maxPerBatchEnvVar)
		if err != nil {
			logger.Warningf(err.Error())
		}
		maxPerBatch = res
	} else {
		maxPerBatch = 10
	}

	queueConfig := common.GetQueueConfig(logger)

	logger.Debugf("Getting fast queue")
	nFast, err := queueConfig.GetNumberOfWaitingTasks("rolodex:update:fast")
	if err != nil {
		logger.Warningf(err.Error())
	}
	logger.Debugf("Number of items in fast queue: %v", nFast)

	logger.Debugf("Getting regular queue")
	nRegular, err := queueConfig.GetNumberOfWaitingTasks("rolodex:update")
	if err != nil {
		logger.Warningf(err.Error())
	}
	logger.Debugf("Number of items in regular queue: %v", nRegular)

	// If we have less than maxPerBatch, don't loop more than the
	// number of items we need to process
	if (nFast + nRegular) < maxPerBatch {
		maxPerBatch = (nFast + nRegular)
	}

	var wg sync.WaitGroup

	workList := []*workingOn{}

	for i := 0; i < maxPerBatch; i++ {
		queue := "rolodex:update:fast"
		nextTask, err := queueConfig.GetTask(queue)
		if err != nil {
			logger.Warningf(err.Error())
		}

		// Nothing in the fast queue, get something from the regular queue
		if nextTask == "" {
			queue = "rolodex:update"
			nextTask, err = queueConfig.GetTask(queue)
			if err != nil {
				logger.Warningf(err.Error())
			}
		}

		// If there's something to work on, work on it
		if nextTask != "" {
			thisTask := &workingOn{
				QueueName:  queue,
				Identifier: nextTask,
			}
			logger.Debugf("Working on %v", nextTask)
			updater, err := rolodex.NewUpdater(nextTask, logger)
			if err != nil {
				logger.Warningf(err.Error())
				continue
			}

			wg.Add(1)
			go updater.Run(&wg)
			workList = append(workList, thisTask)
		}
	}

	wg.Wait()
	for _, task := range workList {
		queueConfig.CompleteTask(task.QueueName, task.Identifier)
	}
}
