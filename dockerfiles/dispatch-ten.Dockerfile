FROM golang:1.12

RUN mkdir /build

COPY go.* /build/
COPY pkg/ /build/pkg/
COPY cmd/dispatchTen/ /build/cmd/dispatchTen/

WORKDIR /build/cmd/dispatchTen

RUN GOOS=linux go build -a -v -o /dispatchTen -ldflags '-s' .
RUN chmod +x /dispatchTen

FROM gcr.io/distroless/base
COPY --from=0 /dispatchTen /bin/dispatchTen
CMD ["/bin/dispatchTen"]