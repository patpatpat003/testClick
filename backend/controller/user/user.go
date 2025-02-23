package user

import (
    "net/http"
    "log"

    "github.com/gin-gonic/gin"
    "example.com/testClick/config"
    "example.com/testClick/entity"
)


func GetAll(c *gin.Context) {
    var users []entity.User
	db := config.DB()
    results := db.Find(&users)

    if results.Error != nil {
        log.Printf("Error fetching users: %v", results.Error)
        c.JSON(http.StatusNotFound, gin.H{"error": "Users not found"})
        return
    }

    c.JSON(http.StatusOK, users)
}

func Get(c *gin.Context) {
    ID := c.Param("id")
    var user entity.User
	db := config.DB()
    results := db.First(&user, ID)

    if results.Error != nil {
        log.Printf("Error fetching user with ID %s: %v", ID, results.Error)
        c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
        return
    }

    if user.ID == 0 {
        c.JSON(http.StatusNoContent, gin.H{})
        return
    }

    c.JSON(http.StatusOK, user)
}