import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTask } from "../context/TaskContext";
import { ConfirmDialog } from "./ConfirmDialog";
import "../theme/task.css";

export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
  dueDate: string;
  createdBy: string;
  assignedTo: string;
}

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export function TaskCard({ task, onEdit }: TaskCardProps) {
  const { username, role } = useAuth();
  const { deleteTask } = useTask();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'TODO': return 'status-todo';
      case 'IN_PROGRESS': return 'status-in-progress';
      case 'COMPLETED': return 'status-completed';
      default: return '';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteTask(task.id);
      setShowDeleteConfirm(false);
    } catch (error) {
      // Error handling is done in the context
      setShowDeleteConfirm(false);
    }
  };

  // Only show delete button for managers
  const canDelete = role === 'MANAGER';

  return (
    <>
      <div className="task-card">
        <div className="task-card-header">
          <h3>{task.title}</h3>
          <div className="task-actions">
            <button
              className="edit-btn"
              onClick={() => onEdit(task)}
              title="Edit task"
            >
              ✎
            </button>
            {canDelete && (
              <button
                className="delete-btn"
                onClick={handleDelete}
                title="Delete task"
              >
                ×
              </button>
            )}
          </div>
        </div>
        <p className="task-description">{task.description}</p>
        <div className="task-meta">
          <span className={`task-status ${getStatusClass(task.status)}`}>
            {task.status.replace('_', ' ')}
          </span>
          <span className="task-due-date">
            Due: {formatDate(task.dueDate)}
          </span>
        </div>
        <div className="task-footer">
          {task.createdBy !== username && (
            <div className="task-created-by">Created by: {task.createdBy}</div>
          )}
          {task.assignedTo !== username && (
            <div className="task-assigned-to">Assigned to: {task.assignedTo}</div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Task"
        message="Are you sure you want to delete this task?"
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  );
}
