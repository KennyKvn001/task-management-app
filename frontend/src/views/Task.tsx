import { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { CreatedTasksSection } from "../components/CreatedTasksSection";
import { AssignedTasksSection } from "../components/AssignedTasksSection";
import { TaskCreationForm } from "../components/TaskCreationForm";
import { useTask } from "../context/TaskContext";
import { useAuth } from "../context/AuthContext";
import type {Task as TaskType} from "../components/TaskCard";
import '../theme/task.css';

export function Task() {
  const {
    createdTasks,
    assignedTasks,
    isLoading,
    error,
    fetchTasks,
    setError
  } = useTask();

  const { isAuthenticated } = useAuth();

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [currentTask, setCurrentTask] = useState<TaskType | undefined>();

  // Single useEffect for initial data load
  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = () => {
    setCurrentTask(undefined);
    setShowTaskModal(true);
  };

  const handleEditTask = (task: TaskType) => {
    setCurrentTask(task);
    setShowTaskModal(true);
  };

  const handleCloseModal = () => {
    setShowTaskModal(false);
    setCurrentTask(undefined);
  };

  return (
    <div className="task-app-container">
      <Header />

      <div className="task-dashboard">
        <div className="task-dashboard-header">
          <h1>Task Dashboard</h1>
          {isAuthenticated && (
            <button className="create-task-btn" onClick={handleCreateTask}>
              Create New Task
            </button>
          )}
        </div>

        {error && (
          <div className="error-message" onClick={() => setError(null)}>
            {error}
            <span className="error-close">×</span>
          </div>
        )}

        <CreatedTasksSection
          tasks={createdTasks}
          isLoading={isLoading}
          onEdit={handleEditTask}
        />

        <AssignedTasksSection
          tasks={assignedTasks}
          isLoading={isLoading}
          onEdit={handleEditTask}
        />
      </div>

      {showTaskModal && (
        <TaskCreationForm
          isOpen={showTaskModal}
          onClose={handleCloseModal}
          task={currentTask}
        />
      )}
    </div>
  );
}
