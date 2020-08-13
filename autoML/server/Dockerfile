FROM golang:latest

RUN mkdir -p /app/src

WORKDIR /app/src

COPY go.mod .

COPY go.sum .

RUN go mod download

COPY . .

EXPOSE 8080

CMD ["make", "dev"]
