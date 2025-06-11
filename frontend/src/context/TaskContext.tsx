// TaskContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { TaskApi, type TaskRequest } from "../services/TaskApi";
import type { Task } from "../components/TaskCard";
import { useAuth } from "./AuthContext";

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
  markTaskAsComplete: (taskId: number) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const { username, isAuthenticated } = useAuth();
  const [createdTasks, setCreatedTasks] = useState<Task[]>([]);
  const [assignedTasks, setAssignedTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastModified, setLastModified] = useState<number>(Date.now());

  const lowerUsername = username?.toLowerCase();

  useEffect(() => {
    if (isAuthenticated && username) {
      fetchTasks();
    }
  }, [username, isAuthenticated, lastModified]);

  const fetchTasks = async () => {
    if (!isAuthenticated || !lowerUsername) return;

    setIsLoading(true);
    setError(null);

    try {
      const allTasks = await TaskApi.getAllTasks();

      setCreatedTasks(
        allTasks.filter(
          (task) => task.createdBy?.toLowerCase() === lowerUsername
        )
      );

      setAssignedTasks(
        allTasks.filter((task) =>
          task.assignedTo
            ?.split(",")
            .map((u) => u.trim().toLowerCase())
            .includes(lowerUsername)
        )
      );
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      setError(err instanceof Error ? err.message : "Failed to load tasks");
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue = useMemo(
    () => ({
      createdTasks,
      assignedTasks,
      isLoading,
      error,

      createTask: async (taskData: TaskRequest): Promise<void> => {
        if (!isAuthenticated) {
          setError("You must be logged in to create tasks");
          throw new Error("Authentication required");
        }

        try {
          setError(null);
          const createdTask = await TaskApi.createTask(taskData);

          if (createdTask.createdBy.toLowerCase() === lowerUsername) {
            setCreatedTasks((prev) => [...prev, createdTask]);
          }

          const assignees = createdTask.assignedTo
            .split(",")
            .map((name) => name.trim().toLowerCase());

          if (assignees.includes(lowerUsername || "")) {
            setAssignedTasks((prev) => [...prev, createdTask]);
          }

          setLastModified(Date.now());
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : "Failed to create task";
          setError(errorMessage);
          throw err;
        }
      },

      updateTask: async (taskId: number, taskData: TaskRequest): Promise<void> => {
        if (!isAuthenticated) {
          setError("You must be logged in to update tasks");
          throw new Error("Authentication required");
        }

        try {
          setError(null);
          const updatedTask = await TaskApi.updateTask(taskId, taskData);

          setCreatedTasks((prev) =>
            prev.map((task) => (task.id === taskId ? updatedTask : task))
          );

          setAssignedTasks((prev) =>
            prev.map((task) => (task.id === taskId ? updatedTask : task))
          );

          setLastModified(Date.now());
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : "Failed to update task";
          setError(errorMessage);
          throw err;
        }
      },

      deleteTask: async (taskId: number): Promise<void> => {
        if (!isAuthenticated) {
          setError("You must be logged in to delete tasks");
          throw new Error("Authentication required");
        }

        try {
          setError(null);
          await TaskApi.deleteTask(taskId);
          setCreatedTasks((prev) => prev.filter((task) => task.id !== taskId));

          setAssignedTasks((prev) => prev.filter((task) => task.id !== taskId));

          setLastModified(Date.now());
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : "Failed to delete task";
          setError(errorMessage);
          throw err;
        }
      },

      markTaskAsComplete: async (taskId: number): Promise<void> => {
        if (!isAuthenticated) {
          setError("You must be logged in to mark tasks as complete");
          throw new Error("Authentication required");
        }

        try {
          setError(null);
          const updatedTask = await TaskApi.markTaskComplete(taskId);

          setCreatedTasks((prev) =>
            prev.map((task) => (task.id === taskId ? updatedTask : task))
          );

          setAssignedTasks((prev) =>
            prev.map((task) => (task.id === taskId ? updatedTask : task))
          );

          setLastModified(Date.now());
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : "Failed to mark task as complete";
          setError(errorMessage);
          throw err;
        }
      },

      fetchTasks,
      setError,
    }),
    [createdTasks, assignedTasks, isLoading, error, isAuthenticated, lowerUsername]
  );

  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  );
}

export const useTask = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTask must be used within a TaskProvider");
  }
  return context;
};
