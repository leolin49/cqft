package main

func main() {
	ffct := &FfctManager{}
	ffct.Init()
	ffct.StartHttpServe()
	ffct.engine.Run(ffct.address)
}
