default:
	GOOS=linux go build -o build/characterUpdater

clean:
	rm -rf build/*

package: clean default
	cd build && zip lambda.zip ./characterUpdater

deploy: clean default package
	aws lambda update-function-code --function-name testGoFunction --zip-file fileb://build/lambda.zip

run: clean default
	./build/characterUpdater