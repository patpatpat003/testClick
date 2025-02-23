import React, { useState, useEffect } from "react";
import "./Board.css";
import { GetAllBoard, CreateBoard, UpdateBoard, DeleteBoard } from "../services/https/index";
import { BoardInterface } from "../interfaces/IBoard";
import ColumnComponent from "./Column"; // Import ColumnComponent

const BoardComponent: React.FC = () => {
    const [boards, setBoards] = useState<BoardInterface[]>([]);
    const [selectedBoardId, setSelectedBoardId] = useState<number | null>(null);
    const [newBoardName, setNewBoardName] = useState('');
    const [editingBoard, setEditingBoard] = useState<BoardInterface | null>(null);
    const [editName, setEditName] = useState('');

    // Fetch all boards on component mount
    useEffect(() => {
        fetchBoards();
        const storedBoardId = localStorage.getItem('selectedBoardId');
        if (storedBoardId) {
            setSelectedBoardId(parseInt(storedBoardId));
        }
    }, []);

    // Fetch all boards
    const fetchBoards = async () => {
        try {
            const res = await GetAllBoard();
            if (res.status === 200) {
                setBoards(res.data);
            }
        } catch (error) {
            console.error("Error fetching boards:", error);
        }
    };

    // Select a board
    const selectBoard = (boardId: number) => {
        setSelectedBoardId(boardId);
        localStorage.setItem('selectedBoardId', boardId.toString());
    };

    // Add a new board
    const handleCreateBoard = async () => {
        if (!newBoardName.trim()) return;
        try {
            const newBoard = { name: newBoardName };
            const res = await CreateBoard(newBoard);
            if (res.status === 201) {
                setBoards([...boards, res.data]); // Update state
                setNewBoardName('');
            }
        } catch (error) {
            console.error("Error creating board:", error);
        }
    };

    // Edit board name
    const handleEditBoard = (board: BoardInterface) => {
        setEditingBoard(board);
        setEditName(board.name || '');
    };

    // Update board name
    const handleUpdateBoard = async () => {
        if (!editingBoard || !editName.trim()) return;
        try {
            const res = await UpdateBoard(editingBoard.ID!, { name: editName });
            if (res.status === 200) {
                setBoards(boards.map((b) => (b.ID === editingBoard.ID ? { ...b, name: editName } : b)));
                setEditingBoard(null); // Exit edit mode
            }
        } catch (error) {
            console.error("Error updating board:", error);
        }
    };

    // Delete a board
    const handleDeleteBoard = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this board?")) return;
        try {
            const res = await DeleteBoard(id);
            if (res.status === 200) {
                setBoards(boards.filter((board) => board.ID !== id)); // Remove from state
                if (selectedBoardId === id) {
                    setSelectedBoardId(null); // Reset selection if deleted
                    localStorage.removeItem('selectedBoardId');
                }
            }
        } catch (error) {
            console.error("Error deleting board:", error);
        }
    };

    return (
        <div className="board-container">
            {/* Sidebar with Board List */}
            <div className="sidebar">
                <h2 className="sidebar-subtitle">My Boards</h2>
                <ul>
                    {boards.map((board) => (
                        <li 
                            key={board.ID} 
                            className={`sidebar-item ${selectedBoardId === board.ID ? 'active' : ''}`}
                            onClick={() => selectBoard(board.ID!)}
                        >
                            {editingBoard?.ID === board.ID ? (
                                <>
                                    <input
                                        type="text"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                    />
                                    <button onClick={handleUpdateBoard}>✅</button>
                                    <button onClick={() => setEditingBoard(null)}>❌</button>
                                </>
                            ) : (
                                <>
                                    {board.name}
                                    <button onClick={() => handleEditBoard(board)}>✏️</button>
                                    <button onClick={() => handleDeleteBoard(board.ID!)}>🗑️</button>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
                <div className="sidebar-add-board">
                    <input
                        type="text"
                        placeholder="New Board"
                        value={newBoardName}
                        onChange={(e) => setNewBoardName(e.target.value)}
                    />
                    <button onClick={handleCreateBoard}>+</button>
                </div>
            </div>

            {/* Pass selectedBoardId to ColumnComponent */}
            <ColumnComponent selectedBoardId={selectedBoardId} />
        </div>
    );
};

export default BoardComponent;
