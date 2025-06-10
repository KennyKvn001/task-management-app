import {type Task, TaskCard} from "./TaskCard";
import "../theme/task.css";

interface CreatedTasksSectionProps {
  tasks: Task[];
  isLoading: boolean;
}

export function CreatedTasksSection({ tasks, isLoading }: CreatedTasksSectionProps) {
  if (isLoading) {
    return <div className="loading-indicator">Loading tasks...</div>;
  }

  return (
    <section className="task-section">
      <h2>Tasks Created by Me</h2>
      <div className="task-grid">
        {tasks.length > 0 ? (
          tasks.map(task => (
            <TaskCard key={`created-${task.id}`} task={task} />
          ))
        ) : (
          <div className="no-tasks-message">
            You haven't created any tasks yet.
          </div>
        )}
      </div>
    </section>
  );
}
