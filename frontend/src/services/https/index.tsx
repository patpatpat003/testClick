import axios from "axios";
import { BoardInterface } from "../../interfaces/IBoard";
import { ColumnInterface } from "../../interfaces/IColumn";
import { Task } from "../../interfaces/ITask";
import { SignInInterface, User } from "../../interfaces/IUser"

const apiUrl = "http://localhost:8000";
const Authorization = localStorage.getItem("token");
const Bearer = localStorage.getItem("token_type");

const requestOptions = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `${Bearer} ${Authorization}`,
  },
};

export async function SignIn(data: SignInInterface) {
  return await axios
    .post(`${apiUrl}/signin`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

export async function CreateUser(data: User) {
  return await axios
    .post(`${apiUrl}/signup`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

export async function GetUsersById(id: string) {
  return await axios
    .get(`${apiUrl}/user/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

export async function GetAllBoard() {
  return await axios
    .get(`${apiUrl}/kanban/boards`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);

}

export async function GetBoard(id: number) {
  return await axios
      .get(`${apiUrl}/kanban/board/${id}`, requestOptions)
      .then((res) => res)
      .catch((e) => e.response);
}

  
export async function CreateBoard(data: BoardInterface) {
  return await axios
    .post(`${apiUrl}/kanban/board`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);

}

export async function UpdateBoard(id: number, data: BoardInterface) {
  return await axios
    .put(`${apiUrl}/kanban/board/${id}`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

export async function DeleteBoard(id: number) {
  return await axios
    .delete(`${apiUrl}/kanban/board/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}
  


export async function GetColumns(id: number) {
  return await axios
      .get(`${apiUrl}/kanban/columns/${id}`, requestOptions)
      .then((res) => res.data || [])
      .catch((err) => {
          console.error("Error fetching add-ons:", err);
          throw err;
      });
}

export async function CreateColumn(data: ColumnInterface) {
  return await axios
    .post(`${apiUrl}/kanban/column`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);

}

export async function UpdateColumn(id: number, data: ColumnInterface) {
  return await axios
    .put(`${apiUrl}/kanban/column/${id}`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

export async function DeleteColumn(id: number) {
  return await axios
    .delete(`${apiUrl}/kanban/column/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

  
  export async function fetchTasks(): Promise<Task[]> {
    try {
      const response = await axios.get(`${apiUrl}/kanban/tasks`, requestOptions);
      return response.data as Task[];
    } catch (error: any) {
      console.error("Error fetching tasks:", error);
      return [];
    }
  }

  export async function createTask(data: Task): Promise<void> {
    try {
      await axios.post(`${apiUrl}/kanban/task`, data, requestOptions);
    } catch (error: any) {
      return error.response;
    }
  }
  
  export async function moveTask(taskId: number, newColumnId: number): Promise<void> {
    try {
      await axios.put(`${apiUrl}/kanban/task/${taskId}`, { column_id: newColumnId }, requestOptions);
    } catch (error: any) {
      return error.response;
    }
  }
  
  export async function deleteTask(taskId: number): Promise<void> {
    try {
      await axios.delete(`${apiUrl}/kanban/task/${taskId}`, requestOptions);
    } catch (error: any) {
      return error.response;
    }
  }
