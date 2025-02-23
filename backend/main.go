package main

import (
    "net/http"
    "github.com/gin-gonic/gin"
    "example.com/testClick/config"
user "example.com/testClick/controller/user"
kanban"example.com/testClick/controller/kanban"
    "example.com/testClick/middlewares"
)

const PORT = "8000"

func main() {
    // Open connection to the database
    config.ConnectionDB()

    // Generate databases
    config.SetupDatabase()

    r := gin.Default()

    r.Use(CORSMiddleware())

    // User Routes
    r.POST("/signup", user.SignUp)
    r.POST("/signin", user.SignIn)

    userRoutes := r.Group("/user")
    {
        userRoutes.Use(middlewares.Authorizes())
        userRoutes.GET("/", user.GetAll)
        userRoutes.GET("/:id", user.Get)
    }

    // Kanban Routes
    kanbanRoutes := r.Group("/kanban")
    {
        kanbanRoutes.Use(middlewares.Authorizes())

        // Board Routes
        kanbanRoutes.GET("/boards", kanban.GetAllBoards)
        kanbanRoutes.GET("/board/:id", kanban.GetBoard)
        kanbanRoutes.POST("/board", kanban.CreateBoard)
        kanbanRoutes.PUT("/board/:id", kanban.UpdateBoard)
        kanbanRoutes.DELETE("/board/:id", kanban.DeleteBoard)

        // Column Routes
        kanbanRoutes.GET("/columns", kanban.GetAllColumns)
        kanbanRoutes.GET("/columns/:board_id", kanban.GetColumnsByBoard)
        kanbanRoutes.POST("/column", kanban.CreateColumn)
        kanbanRoutes.PUT("/column/:id", kanban.UpdateColumn)
        kanbanRoutes.DELETE("/column/:id", kanban.DeleteColumn)

        // Task Routes
        kanbanRoutes.GET("/tasks", kanban.GetAllTasks)
        kanbanRoutes.GET("/task/:id", kanban.GetTask)
        kanbanRoutes.POST("/task", kanban.CreateTask)
        kanbanRoutes.PUT("/task/:id", kanban.UpdateTask)
        kanbanRoutes.DELETE("/task/:id", kanban.DeleteTask)
    }

    r.GET("/", func(c *gin.Context) {
        c.String(http.StatusOK, "API RUNNING... PORT: %s", PORT)
    })

    // Run the server
    r.Run(":" + PORT)
}

func CORSMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        origin := c.Request.Header.Get("Origin")
        c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
        c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
        c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
        c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

        if c.Request.Method == "OPTIONS" {
            c.AbortWithStatus(204)
            return
        }

        c.Next()
    }
}