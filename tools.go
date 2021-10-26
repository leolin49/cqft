package main

import (
	"math/rand"
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
