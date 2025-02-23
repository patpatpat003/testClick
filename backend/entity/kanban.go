package entity

import "gorm.io/gorm"

type Board struct {
	gorm.Model
	Name string `json:"name" `

    Columns []Column `json:"columns" gorm:"foreignKey:BoardID`
}

type Column struct {
	gorm.Model
	Name   string `json:"name" gorm:"not null"`
	BoardID uint   `json:"board_id" gorm:"not null"`
    Board   Board  `gorm:"foreignKey:BoardID"`
    
    Tasks   []Task `gorm:"foreignKey:ColumnID"`
}

type Task struct {
    gorm.Model
    Title       string `json:"name" gorm:"not null"`
    Description string `json:"description"`
    ColumnID    uint   `json:"column_id" gorm:"not null"`
    Column      Column `gorm:"foreignKey:ColumnID"`
    
    AssigneeID uint      `json:"assignee_id"`  
    Assignee   User      `json:"assignee" gorm:"foreignKey:AssigneeID"`
}
