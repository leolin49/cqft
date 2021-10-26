package main

import (
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
	ServerIp   string `yaml:"server_ip"`
	ServerPort string `yaml:"server_port"`
	FilePath   string `yaml:"file_path"`
}

func (this *ConfigMgr) LoadGlobalConfig() {
	this.global = &GlobalConfig{}
	yamlFile, err := ioutil.ReadFile("./config.yaml")
	if err != nil {

	}

	err = yaml.Unmarshal(yamlFile, this.global)
	if err != nil {

	}
}
