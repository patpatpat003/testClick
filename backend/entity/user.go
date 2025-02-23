package entity

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Username string `json:"username" `
	Password string `json:"-" `
	Email    string `json:"email"`
}
