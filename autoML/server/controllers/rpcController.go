package controllers

import (
	"fmt"
	"log"
	"net/http"
	"github.com/gin-gonic/gin"
	"encoding/json"
	"github.com/google/uuid"
	"github.com/streadway/amqp"
)

// Upload a single file
func TrainModel(c *gin.Context){
	fileOne := c.Param("fileOne")
	fileTwo := c.Param("fileTwo")

	res, err := demoRPC(map[string]string{"string": "test string"})

	if err != nil {
		log.Fatalf("'Failed to handle RPC request': %s", err)
		c.JSON(http.StatusInternalServerError, err)
	}

	log.Printf("%d", res["length"])
	c.JSON(http.StatusOK, res)
}

func failOnError(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
	}
}

func demoRPC(request map[string]string) (res map[string]int, err error) {
	conn, err := amqp.Dial("amqp://localhost:5672/")
	failOnError(err, "Failed to connect to RabbitMQ")
	defer conn.Close()

	ch, err := conn.Channel()
	failOnError(err, "Failed to open a channel")
	defer ch.Close()

	q, err := ch.QueueDeclare(
		"",    // name
		false, // durable
		false, // delete when unused
		true,  // exclusive
		false, // noWait
		nil,   // arguments
	)
	failOnError(err, "Failed to declare a queue")

	msgs, err := ch.Consume(
		q.Name, // queue
		"",     // consumer
		true,   // auto-ack
		false,  // exclusive
		false,  // no-local
		false,  // no-wait
		nil,    // args
	)
	failOnError(err, "Failed to register a consumer")

	corrId := uuid.New().String()
	body, _ := json.Marshal(request)

	err = ch.Publish(
		"",          // exchange
		"rpc_queue", // routing key
		false,       // mandatory
		false,       // immediate
		amqp.Publishing{
			ContentType:   "text/plain",
			CorrelationId: corrId,
			ReplyTo:       q.Name,
			Body:          body,
		})
	failOnError(err, "Failed to publish a message")

	for d := range msgs {
		if corrId == d.CorrelationId {
			json.Unmarshal(d.Body, &res)
			failOnError(err, "Failed to convert body")
			break
		}
	}
	return
}
