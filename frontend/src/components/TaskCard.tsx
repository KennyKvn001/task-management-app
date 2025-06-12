import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTask } from "../context/TaskContext";
import { useViewContext } from "../context/ViewContext";
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
  completedBy?: string;
}

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export function TaskCard({ task, onEdit }: TaskCardProps) {
  const { username, isAuthenticated } = useAuth();
  const { deleteTask, markTaskAsComplete } = useTask();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const viewContext = useViewContext();

  const isCreator = username === task.createdBy;

  const isAssigned = task.assignedTo.split(',').map(name => name.trim()).includes(username || "");

  const isSelfAssigned = isCreator && isAssigned;

  const completedUsers = task.completedBy ? task.completedBy.split(',').map(name => name.trim()) : [];

  const hasUserCompletedTask = username ? completedUsers.includes(username) : false;


  const canMarkComplete = isAssigned && !hasUserCompletedTask;

  const getStatusClass = (status: string) => {
    if (viewContext === 'assigned') {
      return hasUserCompletedTask ? 'status-completed' : 'status-todo';
    }

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
      setShowDeleteConfirm(false);
    }
  };

  const handleMarkAsComplete = async () => {
    try {
      setIsCompleting(true);
      await markTaskAsComplete(task.id);
    } catch (error) {
      console.error("Error marking task as complete:", error);
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <>
      <div className="task-card">
        <div className="task-card-header">
          <h3>{task.title}</h3>
          {isAuthenticated && (
            <div className="task-actions">
              {isCreator && (viewContext === 'created' || !isSelfAssigned) && (
                <button
                  className="edit-btn"
                  onClick={() => onEdit(task)}
                  title="Edit task"
                >
                  ✎
                </button>
              )}
              {isCreator && (viewContext === 'created' || !isSelfAssigned) && (
                <button
                  className="delete-btn"
                  onClick={handleDelete}
                  title="Delete task"
                >
                  ×
                </button>
              )}
              {isAssigned && canMarkComplete && viewContext === 'assigned' && (
                <button
                  className="complete-btn"
                  onClick={handleMarkAsComplete}
                  disabled={isCompleting}
                  title="Mark as complete"
                >
                  ✓
                </button>
              )}
            </div>
          )}
        </div>
        <p className="task-description">{task.description}</p>
        <div className="task-meta">
          <span className={`task-status ${getStatusClass(task.status)}`}>
            {viewContext === 'assigned' 
              ? (hasUserCompletedTask ? 'COMPLETED' : 'TODO')
              : task.status.replace('_', ' ')}
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
          {task.completedBy && (
            <div className="task-completed-by">
              Completed by: {task.completedBy}
            </div>
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
