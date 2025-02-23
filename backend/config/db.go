package config

import (
	"fmt"
	"example.com/testClick/entity"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var db *gorm.DB

func DB() *gorm.DB {
	return db
}

func ConnectionDB() {
	database, err := gorm.Open(sqlite.Open("testClick.db?cache=shared"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}
	fmt.Println("connected database")
	db = database
}

func SetupDatabase() {
	err := db.AutoMigrate(
		&entity.User{},
		&entity.Board{},
		&entity.Column{},
		&entity.Task{},
	)	
	if err != nil {
		panic("Failed to migrate database schema: " + err.Error())
	}

	hashedPassword, _ := HashPassword("1")

	user := &entity.User{
		Username:    "test",
		Email:       "test@gmail.com",
		Password:    hashedPassword,
	}
	db.FirstOrCreate(&user, &entity.User{
		Email: "test@gmail.com",
	})


	

}