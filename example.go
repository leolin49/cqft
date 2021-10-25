package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
)

type FfctManager struct {
	engine *gin.Engine
}

func main() {
	router := gin.Default()
	ffct := FfctManager{engine: router}
	ffct.StartHttpServe()
	ffct.engine.Run(":8081")
}

func (this *FfctManager) RegisterGetPing() {
	this.engine.GET("/ping", func(context *gin.Context) {
		context.JSON(200, gin.H{
			"message": "pong",
		})
	})
}

func (this *FfctManager) RegisterPostUploadFile() {
	this.engine.MaxMultipartMemory = 8 << 20	// 8MiB
	this.engine.POST("/uploadfile", func(context *gin.Context) {
		file, _ := context.FormFile("file")
		log.Println(file.Filename)
		err := context.SaveUploadedFile(file, "./" + file.Filename)
		if err != nil {
			context.String(http.StatusServiceUnavailable, err.Error())
			return
		}
		context.String(http.StatusOK, fmt.Sprintf("'%s' uploaded!", file.Filename))
	})
}

func (this *FfctManager) RegisterHomePage() {
	this.engine.LoadHTMLFiles("./home.html", "./test.html")
	this.engine.GET("/", func(context *gin.Context) {
		context.HTML(http.StatusOK, "home.html", gin.H{
			"title": "Main website",
		})
	})
}

func (this *FfctManager) StartHttpServe() {
	this.RegisterHomePage()
	this.RegisterGetPing()
	this.RegisterPostUploadFile()
}