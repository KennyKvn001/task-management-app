import type { Task } from "../components/TaskCard";

export interface TaskRequest {
  title: string;
  description: string;
  dueDate: string;
  assignedUserIds: number[];
}

const API_BASE_URL = '/tasks';

export const TaskApi = {
  getAllTasks: async (): Promise<Task[]> => {
    const token = localStorage.getItem('token');
    const response = await fetch(API_BASE_URL, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch tasks: ${response.status}`);
    }

    const data = await response.json();
    return data.map(mapResponseToTask);
  },

  createTask: async (task: TaskRequest): Promise<Task> => {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_BASE_URL}/new`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        assignedUserIds: task.assignedUserIds
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create task: ${response.status}`);
    }

    const data = await response.json();
    console.log('Response from server after create:', data);
    return mapResponseToTask(data);
  },

  updateTask: async (id: number, task: TaskRequest): Promise<Task> => {
    const token = localStorage.getItem('token');
    console.log('Updating task with payload:', JSON.stringify(task));

    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        assignedUserIds: task.assignedUserIds
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update task: ${response.status}`);
    }

    const data = await response.json();
    console.log('Response from server after update:', data);
    return mapResponseToTask(data);
  },

  deleteTask: async (id: number): Promise<void> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete task: ${response.status}`);
    }
  },

  markTaskComplete: async (id: number): Promise<Task> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/${id}/complete`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to mark task as complete: ${response.status}`);
    }

    const data = await response.json();
    return mapResponseToTask(data);
  }
};

function mapResponseToTask(data: any): Task {
  console.log('Mapping response to task:', data);
  return {
    id: data.id,
    title: data.title,
    description: data.description || "",
    status: data.completedUsernames?.length > 0 ? 'COMPLETED' : 'TODO',
    dueDate: data.dueDate,
    createdBy: data.createdByUsername,
    assignedTo: Array.isArray(data.assignedUsernames)
      ? data.assignedUsernames.join(', ')
      : data.assignedUsernames || ""
  };
}
