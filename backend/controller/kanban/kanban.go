package kanban

import (
    "net/http"
    "log"

    "github.com/gin-gonic/gin"
    "example.com/testClick/config"
    "example.com/testClick/entity"
)



//  Board
func GetAllBoards(c *gin.Context) {
    var boards []entity.Board
    db := config.DB()
    results := db.Find(&boards)

    if results.Error != nil {
        log.Printf("Error fetching boards: %v", results.Error)
        c.JSON(http.StatusNotFound, gin.H{"error": "Boards not found"})
        return
    }

    c.JSON(http.StatusOK, boards)
}

func GetBoard(c *gin.Context) {
    boardID := c.Param("id") // Get board ID from URL
    var board entity.Board
    db := config.DB()

    log.Println("Fetching board with ID:", boardID) // Debugging

    if err := db.First(&board, "id = ?", boardID).Error; err != nil {
        log.Println("Board not found:", err) // Debugging
        c.JSON(http.StatusNotFound, gin.H{"error": "Board not found"})
        return
    }
    c.JSON(http.StatusOK, board)
}


func CreateBoard(c *gin.Context) {
    var board entity.Board
    if err := c.ShouldBindJSON(&board); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    db := config.DB()
    if err := db.Create(&board).Error; err != nil {
        log.Printf("Error creating board: %v", err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create board"})
        return
    }

    c.JSON(http.StatusCreated, board)
}

func UpdateBoard(c *gin.Context) {
    ID := c.Param("id")
    var board entity.Board
    db := config.DB()
    if err := db.First(&board, ID).Error; err != nil {
        log.Printf("Error fetching board with ID %s: %v", ID, err)
        c.JSON(http.StatusNotFound, gin.H{"error": "Board not found"})
        return
    }

    if err := c.ShouldBindJSON(&board); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    if err := db.Save(&board).Error; err != nil {
        log.Printf("Error updating board with ID %s: %v", ID, err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update board"})
        return
    }

    c.JSON(http.StatusOK, board)
}

func DeleteBoard(c *gin.Context) {
    ID := c.Param("id")
    var board entity.Board
    db := config.DB()
    if err := db.First(&board, ID).Error; err != nil {
        log.Printf("Error fetching board with ID %s: %v", ID, err)
        c.JSON(http.StatusNotFound, gin.H{"error": "Board not found"})
        return
    }

    if err := db.Delete(&board).Error; err != nil {
        log.Printf("Error deleting board with ID %s: %v", ID, err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete board"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Board deleted"})
}

//  Column
func GetAllColumns(c *gin.Context) {
    var columns []entity.Column
    db := config.DB()
    results := db.Find(&columns)

    if results.Error != nil {
        log.Printf("Error fetching columns: %v", results.Error)
        c.JSON(http.StatusNotFound, gin.H{"error": "Columns not found"})
        return
    }

    c.JSON(http.StatusOK, columns)
}

func GetColumnsByBoard(c *gin.Context) {
    boardID := c.Param("board_id") 
    db := config.DB()
    var columns []entity.Column

    if err := db.Where("board_id = ?", boardID).Find(&columns).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve columns"})
        return
    }

    c.JSON(http.StatusOK, columns) 
}


func CreateColumn(c *gin.Context) {
    var column entity.Column
    if err := c.ShouldBindJSON(&column); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    db := config.DB()
    if err := db.Create(&column).Error; err != nil {
        log.Printf("Error creating column: %v", err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create column"})
        return
    }

    c.JSON(http.StatusCreated, column)
}

func UpdateColumn(c *gin.Context) {
    ID := c.Param("id")
    var column entity.Column
    db := config.DB()
    if err := db.First(&column, ID).Error; err != nil {
        log.Printf("Error fetching column with ID %s: %v", ID, err)
        c.JSON(http.StatusNotFound, gin.H{"error": "Column not found"})
        return
    }

    if err := c.ShouldBindJSON(&column); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    if err := db.Save(&column).Error; err != nil {
        log.Printf("Error updating column with ID %s: %v", ID, err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update column"})
        return
    }

    c.JSON(http.StatusOK, column)
}

func DeleteColumn(c *gin.Context) {
    ID := c.Param("id")
    var column entity.Column
    db := config.DB()
    if err := db.First(&column, ID).Error; err != nil {
        log.Printf("Error fetching column with ID %s: %v", ID, err)
        c.JSON(http.StatusNotFound, gin.H{"error": "Column not found"})
        return
    }

    if err := db.Delete(&column).Error; err != nil {
        log.Printf("Error deleting column with ID %s: %v", ID, err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete column"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Column deleted"})
}

// Task
func GetAllTasks(c *gin.Context) {
    var tasks []entity.Task
    db := config.DB()
    results := db.Preload("Assignee").Find(&tasks)

    if results.Error != nil {
        log.Printf("Error fetching tasks: %v", results.Error)
        c.JSON(http.StatusNotFound, gin.H{"error": "Tasks not found"})
        return
    }

    c.JSON(http.StatusOK, tasks)
}

func GetTask(c *gin.Context) {
    ID := c.Param("id")
    var task entity.Task
    db := config.DB()
    results := db.Preload("Assignee").First(&task, ID)

    if results.Error != nil {
        log.Printf("Error fetching task with ID %s: %v", ID, results.Error)
        c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
        return
    }

    c.JSON(http.StatusOK, task)
}

func CreateTask(c *gin.Context) {
    var task entity.Task
    if err := c.ShouldBindJSON(&task); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    db := config.DB()
    if err := db.Create(&task).Error; err != nil {
        log.Printf("Error creating task: %v", err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create task"})
        return
    }

    c.JSON(http.StatusCreated, task)
}

func UpdateTask(c *gin.Context) {
    ID := c.Param("id")
    var task entity.Task
    db := config.DB()
    if err := db.First(&task, ID).Error; err != nil {
        log.Printf("Error fetching task with ID %s: %v", ID, err)
        c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
        return
    }

    if err := c.ShouldBindJSON(&task); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    if err := db.Save(&task).Error; err != nil {
        log.Printf("Error updating task with ID %s: %v", ID, err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update task"})
        return
    }

    c.JSON(http.StatusOK, task)
}

func DeleteTask(c *gin.Context) {
    ID := c.Param("id")
    var task entity.Task
    db := config.DB()
    if err := db.First(&task, ID).Error; err != nil {
        log.Printf("Error fetching task with ID %s: %v", ID, err)
        c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
        return
    }

    if err := db.Delete(&task).Error; err != nil {
        log.Printf("Error deleting task with ID %s: %v", ID, err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete task"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Task deleted"})
}