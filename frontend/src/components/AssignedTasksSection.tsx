import { TaskCard, type Task } from "./TaskCard";
import "../theme/task.css";

interface AssignedTasksSectionProps {
  tasks: Task[];
  isLoading: boolean;
  onEdit: (task: Task) => void;
}

export function AssignedTasksSection({ tasks, isLoading, onEdit }: AssignedTasksSectionProps) {
  if (isLoading) {
    return <div className="loading-indicator">Loading tasks...</div>;
  }

  return (
    <section className="task-section">
      <h2>Tasks Assigned to Me</h2>
      <div className="task-grid">
        {tasks.length > 0 ? (
          tasks.map(task => (
            <TaskCard
              key={`assigned-${task.id}`}
              task={task}
              onEdit={onEdit}
            />
          ))
        ) : (
          <div className="no-tasks-message">
            No tasks have been assigned to you.
          </div>
        )}
      </div>
    </section>
  );
}
