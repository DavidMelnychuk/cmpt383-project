package main

import (
	"fmt"
	"log"
	"net/http"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"encoding/json"
	"github.com/google/uuid"
	"github.com/streadway/amqp"
)
const UPLOAD_FILE_DR = "uploadedFiles/"

func failOnError(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
	}
}

// TODO: Refactor to follow MVC once done, for now put it all in one main server file until it gets unwieldy
func main() {
	r := gin.Default()
	r.Use(cors.Default())




	r.GET("/train", func(c *gin.Context) {
		res, err := demoRPC(map[string]string{"string": "test string"})
		failOnError(err, "Failed to handle RPC request")
	
		log.Printf("%d", res["length"])



		c.JSON(http.StatusOK, res)



	})






	// Handle Single File Upload
	r.POST("/upload", func(c *gin.Context) {
		// single file
		file, err := c.FormFile("file")
		if err != nil {
			log.Fatal(err)
		}
		log.Println(file.Filename)
		// Upload the file to specific dst.
		dst := UPLOAD_FILE_DR + file.Filename
		err = c.SaveUploadedFile(file, dst)
		if err != nil {
			log.Fatal(err)
		}
		c.String(http.StatusOK, fmt.Sprintf("'%s' uploaded!", file.Filename))
	})

	



	// Serve our uploaded files so that python server can access them for ML training
	r.Static(UPLOAD_FILE_DR, "./uploadedFiles")

	r.Run() // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
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
