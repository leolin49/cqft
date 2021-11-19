package main

import (
	"gintest/glog"
	"gopkg.in/yaml.v2"
	"io/ioutil"
)

type ConfigMgr struct {
	global *GlobalConfig
}

var configm *ConfigMgr

func ConfigMgr_GetMe() *ConfigMgr {
	if configm == nil {
		configm = &ConfigMgr{}
		configm.LoadGlobalConfig()
	}
	return configm
}

type GlobalConfig struct {
	ServerIp    string `yaml:"server_ip"`
	ServerPort  string `yaml:"server_port"`
	FilePath    string `yaml:"file_path"`
	LogPath     string `yaml:"log_path"`
	LogLevel    string `yaml:"log_level"`
	LogToStdErr string `yaml:"log_to_std_err"`
}

func (this *ConfigMgr) LoadGlobalConfig() {
	this.global = &GlobalConfig{}
	yamlFile, err := ioutil.ReadFile("./bin/config.yaml")
	if err != nil {
		glog.Error("[ConfigMgr] Read config file error")
		return
	}

	err = yaml.Unmarshal(yamlFile, this.global)
	if err != nil {
		glog.Error("[ConfigMgr] Unmarshal config file error")
		return
	}
}
