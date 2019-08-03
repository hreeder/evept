FROM golang:1.12

RUN mkdir /build

COPY go.* /build/
COPY pkg/ /build/pkg/
COPY cmd/characterUpdater/ /build/cmd/characterUpdater/

WORKDIR /build/cmd/characterUpdater

RUN GOOS=linux go build -a -v -o /characterUpdater -ldflags '-s' .
RUN chmod +x /characterUpdater

FROM gcr.io/distroless/base
COPY --from=0 /characterUpdater /bin/characterUpdater
CMD ["/bin/characterUpdater"]