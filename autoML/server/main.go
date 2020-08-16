package main

import (
	"autoML/controllers"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)
const uploadFilesDir = "uploadedFiles/"

func main() {
	r := gin.Default()
	r.Use(cors.Default())
	// RPC Request to train model
	r.POST("/train/:fileOne/:fileTwo", controllers.TrainModel)
	// Handle Single File Upload
	r.POST("/upload", controllers.UploadFile)
	// Serve uploaded files so that python server can access them for ML training
	r.Static(uploadFilesDir, "./uploadedFiles")
	r.Run() // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}