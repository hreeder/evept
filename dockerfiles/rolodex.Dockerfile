FROM golang:1.12

RUN mkdir /build

COPY go.* /build/
COPY pkg/ /build/pkg/
COPY services/rolodex/ /build/services/rolodex/

WORKDIR /build/services/rolodex

RUN CGO_ENABLED=0 GOOS=linux go build -a -v -o /rolodex -installsuffix cgo -ldflags '-extldflags "-static"' .
RUN chmod +x /rolodex

FROM alpine:3.10
RUN apk --no-cache add ca-certificates
WORKDIR /
COPY --from=0 /rolodex /bin/rolodex
CMD ["/bin/rolodex"]