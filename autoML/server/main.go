package main

import (
	"autoML/controllers"
	// "fmt"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)
const UPLOAD_FILE_DR = "uploadedFiles/"

func main() {
	r := gin.Default()
	r.Use(cors.Default())
	
	// RPC Request to train model
	r.GET("/train", controllers.TrainModel)
	// Handle Single File Upload
	r.POST("/upload", controllers.UploadFile)
	// Serve our uploaded files so that python server can access them for ML training
	r.Static(UPLOAD_FILE_DR, "./uploadedFiles")
	r.Run() // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}