/*import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./kanban.css";
import Board from "../../components/Board";
import Column from "../../components/Column"
import { GetColumns, GetBoard } from "../../services/https/index";
import { ColumnInterface } from "../../interfaces/IColumn";

const KanbanBoard: React.FC = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const boardId = queryParams.get("boardId");
    
    const [columns, setColumns] = useState<ColumnInterface[]>([]);
    const [boardName, setBoardName] = useState<string | null>(null);

    useEffect(() => {
        if (boardId) {
            fetchBoardDetails(parseInt(boardId));
            fetchColumns(parseInt(boardId));
        }
    }, [boardId]);

    const fetchBoardDetails = async (boardId: number) => {
        try {
            const res = await GetBoard(boardId);
            if (res.status === 200 && res.data) {
                setBoardName(res.data.name);
            }
        } catch (error) {
            console.error("Error fetching board name:", error);
        }
    };

    const fetchColumns = async (boardId: number) => {
        try {
            const res = await GetColumns(boardId);
            if (res.length > 0) {
                setColumns(res);
            }
        } catch (error) {
            console.error("Error fetching columns:", error);
        }
    };

    return (
        <div className="kanban-container">
        <Board /> {}
        <div className="kanban-content">
            <h2 className="kanban-title">{boardName ? `Board: ${boardName}` : ""}</h2>
            <div className="columns">
                {columns.map((column) => (
                    <div key={column.ID} className="column">
                        <h3>{column.name}</h3>
                    </div>
                ))}
            </div>
        </div>
    </div>
    );
};

export default KanbanBoard;*/

import React from "react";
import "./kanban.css";
import Board from "../../components/Board"
import Column from "../../components/Column"
import { Button,message  } from "antd";

const KanbanBoard: React.FC = () => {
    const [messageApi, contextHolder] = message.useMessage();

    const Logout = () => {

        localStorage.clear();
    
        messageApi.success("Logout successful");
    
        setTimeout(() => {
    
          location.href = "/signin";
    
        }, 2000);
    
      };

    return (

        <div>
        <Board />
        <Button onClick={Logout} style={{ margin: 4 }}>
            ออกจากระบบ
        </Button>

        </div>
        

    );


};
export default KanbanBoard;



