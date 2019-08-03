FROM golang:1.12

RUN mkdir /build

COPY go.* /build/
COPY pkg/ /build/pkg/
COPY services/rolodex/ /build/services/rolodex/

WORKDIR /build/services/rolodex

RUN GOOS=linux go build -a -v -o /rolodex -ldflags '-s' .
RUN chmod +x /rolodex

FROM gcr.io/distroless/base
COPY --from=0 /rolodex /bin/rolodex
CMD ["/bin/rolodex"]