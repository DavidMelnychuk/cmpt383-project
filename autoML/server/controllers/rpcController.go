package controllers

import (
	"encoding/json"
	"log"
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/streadway/amqp"
)

// Upload a single file
func TrainModel(c *gin.Context) {
	fileOne := c.Param("fileOne")
	fileTwo := c.Param("fileTwo")

	log.Println("File One:", fileOne)
	log.Println("File Two:", fileTwo)

	res, err := trainModelRPC(map[string]string{
		"fileOne": fileOne,
		"fileTwo": fileTwo,
	})

	if err != nil {
		log.Fatalf("'Failed to handle RPC request': %s", err)
		c.JSON(http.StatusInternalServerError, err)
	}

	log.Println("Response: ", res)
	// Send response back as JSON
	c.JSON(http.StatusOK, res)
}

func failOnError(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
	}
}

// RPC Call to python server to train model
// Make sure response JSON structure matches that of python server, else fields that don't
// match will be ignored: https://blog.golang.org/json
// Interface{} will take all JSON types
func trainModelRPC(request map[string]string) (res map[string]interface{}, err error) {
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
