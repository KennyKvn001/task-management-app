import type { Task } from "../components/TaskCard";

export interface TaskRequest {
  title: string;
  description: string;
  dueDate: string;
  assignedUserIds: number[];
}

interface TaskResponse {
  id: number;
  title: string;
  description: string | null;
  dueDate: string;
  createdByUsername: string;
  assignedUsernames: string[];
  completedUsernames: string[];
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

function mapResponseToTask(data: TaskResponse): Task {
  const assignedUsernames = Array.isArray(data.assignedUsernames) ? data.assignedUsernames : [];
  const completedUsernames = Array.isArray(data.completedUsernames) ? data.completedUsernames : [];
  const assignedCount = assignedUsernames.length;
  const completedCount = completedUsernames.length;

  const currentUsername = localStorage.getItem('username');

  let status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED' = 'TODO';

  const isAssignee = assignedUsernames.some(username =>
    username.toLowerCase() === currentUsername?.toLowerCase()
  );
  const hasCompleted = completedUsernames.some(username =>
    username.toLowerCase() === currentUsername?.toLowerCase()
  );

  if (isAssignee) {
    status = hasCompleted ? 'COMPLETED' : 'TODO';
  } else {
    if (completedCount === 0) {
      status = 'TODO';
    } else if (completedCount < assignedCount) {
      status = 'IN_PROGRESS';
    } else if (completedCount === assignedCount && assignedCount > 0) {
      status = 'COMPLETED';
    }
  }

  return {
    id: data.id,
    title: data.title,
    description: data.description || "",
    status: status,
    dueDate: data.dueDate,
    createdBy: data.createdByUsername,
    assignedTo: assignedUsernames.join(', ') || "",
    completedBy: completedUsernames.length > 0 ? completedUsernames.join(', ') : ""
  };
}
