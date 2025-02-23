import React, { useState, useEffect } from "react";
import "./Column.css";
import { GetColumns, CreateColumn, UpdateColumn, DeleteColumn, GetBoard } from "../services/https/index";
import { ColumnInterface } from "../interfaces/IColumn";

interface ColumnProps {
    selectedBoardId: number | null;
}

const ColumnComponent: React.FC<ColumnProps> = ({ selectedBoardId }) => {
    const [columns, setColumns] = useState<ColumnInterface[]>([]);
    const [boardName, setBoardName] = useState<string | null>(null);
    const [newColumnName, setNewColumnName] = useState("");
    const [editingColumn, setEditingColumn] = useState<ColumnInterface | null>(null);
    const [editName, setEditName] = useState("");

    // Fetch board name and columns when board selection changes
    useEffect(() => {
        if (selectedBoardId) {
            fetchBoardName(selectedBoardId);
            fetchColumns(selectedBoardId);
        }
    }, [selectedBoardId]);

    // Fetch board name
    const fetchBoardName = async (boardId: number) => {
        try {
            const res = await GetBoard(boardId);
            if (res.status === 200) {
                setBoardName(res.data.name);
            }
        } catch (error) {
            console.error("Error fetching board name:", error);
        }
    };

    // Fetch columns for the selected board
    const fetchColumns = async (boardId: number) => {
        try {
            console.log("Fetching columns for board:", boardId);
            const res = await GetColumns(boardId);
            console.log("Columns received:", res);
            setColumns(res);
        } catch (error) {
            console.error("Error fetching columns:", error);
        }
    };

    // Create a new column
    const handleCreateColumn = async () => {
        if (!newColumnName.trim() || !selectedBoardId) return;
        try {
            const newColumn: ColumnInterface = { name: newColumnName, board_id: selectedBoardId };
            await CreateColumn(newColumn);
            fetchColumns(selectedBoardId);
            setNewColumnName("");
        } catch (error) {
            console.error("Error creating column:", error);
        }
    };

    // Enable edit mode for a column
    const handleEditColumn = (column: ColumnInterface) => {
        setEditingColumn(column);
        setEditName(column.name || "");
    };

    // Update a column name
    const handleUpdateColumn = async () => {
        if (!editingColumn || !editName.trim()) return;
        try {
            await UpdateColumn(editingColumn.ID!, { name: editName });
            fetchColumns(selectedBoardId!);
            setEditingColumn(null);
        } catch (error) {
            console.error("Error updating column:", error);
        }
    };

    // Delete a column
    const handleDeleteColumn = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this column?")) return;
        try {
            await DeleteColumn(id);
            fetchColumns(selectedBoardId!);
        } catch (error) {
            console.error("Error deleting column:", error);
        }
    };

    return (
        <div className="kanban-content">
            {selectedBoardId ? (
                <>
                    <h2 className="kanban-title">{boardName ? boardName : "Loading Board..."}</h2>
                    <div className="columns">
                        {columns.length > 0 ? (
                            columns.map((column) => (
                                <div key={column.ID} className="column">
                                    {editingColumn?.ID === column.ID ? (
                                        <>
                                            <input
                                                type="text"
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                            />
                                            <button onClick={handleUpdateColumn}>✅</button>
                                            <button onClick={() => setEditingColumn(null)}>❌</button>
                                        </>
                                    ) : (
                                        <>
                                            <h3>{column.name}</h3>
                                            <button onClick={() => handleEditColumn(column)}>✏️</button>
                                            <button onClick={() => handleDeleteColumn(column.ID!)}>🗑️</button>
                                        </>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p>No columns available for this board.</p>
                        )}
                    </div>
                    <div className="create-column">
                        <input
                            type="text"
                            value={newColumnName}
                            onChange={(e) => setNewColumnName(e.target.value)}
                            placeholder="New Column Name"
                        />
                        <button onClick={handleCreateColumn}>Add Column</button>
                    </div>
                </>
            ) : (
                <p>Please select a board.</p>
            )}
        </div>
    );
};

export default ColumnComponent;
