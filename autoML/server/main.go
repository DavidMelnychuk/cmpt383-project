package main

import (
	"fmt"
	"log"
	"net/http"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	// "encoding/json"
	// "github.com/google/uuid"
	// "github.com/streadway/amqp"
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
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
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
