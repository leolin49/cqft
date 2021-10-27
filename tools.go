package main

import (
	"math/rand"
	"os"
	"strconv"
	"time"
)

func RandBetween(min, max int64) int64 {
	rand.Seed(time.Now().UnixNano())
	if min == max {
		return min
	}
	if min > max {
		min, max = max, min
	}
	n := max - min + 1
	if n <= 0 {
		return 0
	}
	return min + rand.Int63n(n)
}

func RandCode() string {
	return strconv.FormatInt(RandBetween(1000, 9999), 10)
}

func File2Bytes(path string) ([]byte, error) {
	file, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	stats, err := file.Stat()
	if err != nil {
		return nil, err
	}

	data := make([]byte, stats.Size())
	_, err = file.Read(data)
	if err != nil {
		return nil, err
	}
	return data, nil
}
