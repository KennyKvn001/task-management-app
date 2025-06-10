import { useAuth } from "../context/AuthContext";
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

export function TaskCard({ task }: { task: Task }) {
  const { username } = useAuth();


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

  return (
    <div className="task-card">
      <div className="task-card-header">
        <h3>{task.title}</h3>
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
  );
}
