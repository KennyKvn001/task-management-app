import { createContext, useState, type ReactNode, useContext } from 'react';
import type {Task} from '../components/TaskCard';
import { TaskApi, type TaskRequest } from '../services/TaskApi';
import { useAuth } from './AuthContext';

interface TaskContextType {
  createdTasks: Task[];
  assignedTasks: Task[];
  isLoading: boolean;
  error: string | null;
  createTask: (taskData: TaskRequest) => Promise<void>;
  updateTask: (taskId: number, taskData: TaskRequest) => Promise<void>;
  deleteTask: (taskId: number) => Promise<void>;
  fetchTasks: () => Promise<void>;
  setError: (error: string | null) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const { username, role } = useAuth();
  const [createdTasks, setCreatedTasks] = useState<Task[]>([]);
  const [assignedTasks, setAssignedTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    if (!username) return;

    try {
      setIsLoading(true);
      setError(null);
      const tasks = await TaskApi.getAllTasks();

      const lowerUsername = username.toLowerCase();
      setCreatedTasks(tasks.filter(task =>
        task.createdBy.toLowerCase() === lowerUsername));

      setAssignedTasks(tasks.filter(task => {
        const assignees = task.assignedTo.split(',').map(name =>
          name.trim().toLowerCase());
        return assignees.includes(lowerUsername);
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  };

  const createTask = async (taskData: TaskRequest) => {
    try {
      setError(null);
      const savedTask = await TaskApi.createTask(taskData);

      // Add to appropriate lists based on user involvement
      if (savedTask.createdBy.toLowerCase() === username?.toLowerCase()) {
        setCreatedTasks(prev => [...prev, savedTask]);
      }

      const assignees = savedTask.assignedTo.split(',').map(name =>
        name.trim().toLowerCase());
      if (assignees.includes(username?.toLowerCase() || '')) {
        setAssignedTasks(prev => [...prev, savedTask]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
      throw err;
    }
  };

  const updateTask = async (taskId: number, taskData: TaskRequest) => {
    try {
      setError(null);
      const targetTask = [...createdTasks, ...assignedTasks].find(t => t.id === taskId);

      // Check permissions
      if (role !== 'MANAGER' && targetTask?.createdBy !== username) {
        throw new Error("You don't have permission to update this task");
      }

      const updatedTask = await TaskApi.updateTask(taskId, taskData);

      // Update in both task lists if present
      setCreatedTasks(prev => prev.map(task =>
        task.id === taskId ? updatedTask : task));
      setAssignedTasks(prev => prev.map(task =>
        task.id === taskId ? updatedTask : task));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
      throw err;
    }
  };

  const deleteTask = async (taskId: number) => {
    try {
      // Check role-based permission
      if (role !== 'MANAGER') {
        throw new Error("Only managers can delete tasks");
      }

      setError(null);
      await TaskApi.deleteTask(taskId);

      // Remove from both task lists
      setCreatedTasks(prev => prev.filter(task => task.id !== taskId));
      setAssignedTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
      throw err;
    }
  };

  return (
    <TaskContext.Provider value={{
      createdTasks,
      assignedTasks,
      isLoading,
      error,
      createTask,
      updateTask,
      deleteTask,
      fetchTasks,
      setError
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export const useTask = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};
