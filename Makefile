characterupdater: 
	rm -rf build/characterUpdater build/characterUpdater.zip
	(cd cmd/characterUpdater && GOOS=linux go build -o ../../build/characterUpdater)
	(cd build && zip characterUpdater.zip ./characterUpdater)
