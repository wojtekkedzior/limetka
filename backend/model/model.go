package model

import (
	"time"
)

type Temperature struct {
	Id          int       `db:"id" json:"id"`
	Humidity    float32   `json:"humidity"`
	Pressure    float32   `json:"pressure"`
	Temperature float32   `json:"temperature"`
	Timestamp   time.Time `json:"timestamp"`
}
