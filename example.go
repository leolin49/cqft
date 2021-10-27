package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
	"os"
)

type FfctManager struct {
	address string
	engine  *gin.Engine
	taskMap map[string]*TcpTask
	fileMap map[string]*FileMgr
}

type FileMgr struct {
	name string
	path string
	size int64
}

type TcpTask struct {
	ip string
}

func main() {
	ffct := &FfctManager{}
	ffct.Init(gin.Default())
	ffct.StartHttpServe()
	ffct.engine.Run(ffct.address)
}

func (this *FfctManager) Init(e *gin.Engine) {
	this.engine = e
	this.LoadStaticFile()
	this.MakeCacheDir()
	this.taskMap = make(map[string]*TcpTask)
	this.fileMap = make(map[string]*FileMgr)
	this.address = fmt.Sprintf("%s:%s", ConfigMgr_GetMe().global.ServerIp, ConfigMgr_GetMe().global.ServerPort)
}

func (this *FfctManager) MakeCacheDir() {
	path := ConfigMgr_GetMe().global.FilePath
	if !IsPathExists(path) {
		err := os.Mkdir(path, os.ModePerm)
		if err != nil {
			log.Println(err.Error())
			return
		}
	}
}

func (this *FfctManager) LoadStaticFile() {
	this.engine.StaticFile("js/helper.js", "./js/helper.js")
	this.engine.StaticFile("js/jquery-3.6.0.js", "./js/jquery-3.6.0.js")
}

func (this *FfctManager) RegisterGetPing() {
	this.engine.GET("/ping", func(context *gin.Context) {
		context.JSON(200, gin.H{
			"message": "pong",
		})
	})
}

func (this *FfctManager) RegisterPostUploadFile() {
	this.engine.MaxMultipartMemory = 8 << 20 // 8MiB
	cfg := ConfigMgr_GetMe().global
	this.engine.POST("/uploadfile", func(context *gin.Context) {
		ipstr := context.ClientIP()
		if _, ok := this.taskMap[ipstr]; !ok {
			context.Redirect(http.StatusTemporaryRedirect, "localhost:8081/")
			return
		}
		_, err := context.MultipartForm()
		if err != nil {
			log.Println(err.Error())
		}
		file, err := context.FormFile("file")
		if err != nil {
			log.Println(err.Error())
			log.Println(context.ContentType())
		}
		if file == nil {
			log.Println("file pointer is nil")
			return
		}
		log.Println(file.Filename)
		err = context.SaveUploadedFile(file, cfg.FilePath+file.Filename)
		if err != nil {
			context.String(http.StatusServiceUnavailable, err.Error())
			return
		}
		code := RandCode()
		this.fileMap[code] = &FileMgr{
			name: file.Filename,
			path: cfg.FilePath + file.Filename,
			size: file.Size,
		}
		log.Println(this.fileMap)

		context.JSON(http.StatusOK, gin.H{
			"status":      200,
			"pickup_code": code,
		})
		//context.String(http.StatusOK, fmt.Sprintf("'%s' uploaded!", file.Filename))
	})
}

func (this *FfctManager) RegisterPostRecvFile() {
	this.engine.POST("/downloadfile", func(context *gin.Context) {
		//log.Println(context.PostForm("test"))
		code := context.PostForm("code")
		log.Println("download file by code : ", code)
		if f, ok := this.fileMap[code]; ok {
			context.Header("Content-Type", "application/octet-stream")
			context.Header("Content-Disposition", "attachment;filename="+f.name)
			context.Header("Content-Transfer-Encoding", "binary")
			context.File(f.path)
			return

		} else if f == nil {
			log.Println("file pointer is nil")
			return
		} else {
			log.Println("no this file:", f.path)
			return
		}
	})
}

func (this *FfctManager) RegisterHomePage() {
	this.engine.LoadHTMLFiles("./home.html")
	this.engine.GET("/", func(context *gin.Context) {
		context.HTML(http.StatusOK, "home.html", gin.H{
			"title": "Main website",
		})
		ipstr := context.ClientIP()
		this.taskMap[ipstr] = &TcpTask{ip: ipstr}
		//log.Println(ipstr)
	})
}

func (this *FfctManager) StartHttpServe() {
	this.RegisterHomePage()
	this.RegisterGetPing()
	this.RegisterPostUploadFile()
	this.RegisterPostRecvFile()
}
