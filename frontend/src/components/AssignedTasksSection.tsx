import {type Task, TaskCard} from "./TaskCard";
import "../theme/task.css";

interface AssignedTasksSectionProps {
  tasks: Task[];
  isLoading: boolean;
}

export function AssignedTasksSection({ tasks, isLoading }: AssignedTasksSectionProps) {
  if (isLoading) {
    return <div className="loading-indicator">Loading tasks...</div>;
  }

  return (
    <section className="task-section">
      <h2>Tasks Assigned to Me</h2>
      <div className="task-grid">
        {tasks.length > 0 ? (
          tasks.map(task => (
            <TaskCard key={`assigned-${task.id}`} task={task} />
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
