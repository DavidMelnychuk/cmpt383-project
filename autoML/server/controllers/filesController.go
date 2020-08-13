package controllers

import (
	"fmt"
	"log"
	"net/http"
	"github.com/gin-gonic/gin"
)
const UPLOAD_FILE_DR = "uploadedFiles/"


// Upload a single file
func UploadFile(c *gin.Context){
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
}