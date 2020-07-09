package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	r.Use(cors.Default())
	// Handle Single File Upload
	r.POST("/upload", func(c *gin.Context) {
		// single file
		file, err := c.FormFile("file")
		if err != nil {
			log.Fatal(err)
		}
		log.Println(file.Filename)

		// Upload the file to specific dst.
		dst := "uploadedFiles/" + file.Filename
		err = c.SaveUploadedFile(file, dst)
		if err != nil {
			log.Fatal(err)
		}
		c.String(http.StatusOK, fmt.Sprintf("'%s' uploaded!", file.Filename))
	})

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})

	// Serve our uploaded files so that python server can access them for ML training
	r.Static("/uploadedFiles", "./uploadedFiles")

	r.Run() // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}
