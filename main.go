package main

import (
	"flag"
	"gintest/glog"
)

var (
	logfile = flag.String("logfile", "", "Log file name")
)

func main() {
	flag.Parse()
	loglevel := ConfigMgr_GetMe().global.LogLevel
	if loglevel != "" {
		flag.Lookup("stderrthreshold").Value.Set(loglevel)
	}

	logtostderr := ConfigMgr_GetMe().global.LogToStdErr
	if logtostderr != "" {
		flag.Lookup("logtostderr").Value.Set(logtostderr)
	}

	if *logfile != "" {
		glog.SetLogFile(*logfile)
	} else {
		glog.SetLogFile(ConfigMgr_GetMe().global.LogPath)
	}

	defer glog.Flush()

	ffct := &FfctManager{}
	ffct.Init()
	ffct.StartHttpServe()
	ffct.engine.Run(ffct.address)

	glog.Info("[FFCT] server close")
}
