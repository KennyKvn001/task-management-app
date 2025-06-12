import { TaskCard, type Task } from "./TaskCard";
import { ViewContextProvider } from "../context/ViewContext";
import "../theme/task.css";

interface CreatedTasksSectionProps {
  tasks: Task[];
  isLoading: boolean;
  onEdit: (task: Task) => void;
}

export function CreatedTasksSection({ tasks, isLoading, onEdit }: CreatedTasksSectionProps) {
  if (isLoading) {
    return <div className="loading-indicator">Loading tasks...</div>;
  }

  return (
    <section className="task-section">
      <h2>Tasks Created by Me</h2>
      <div className="task-grid">
        {tasks.length > 0 ? (
          tasks.map(task => (
            <ViewContextProvider key={`created-${task.id}`} viewType="created">
              <TaskCard
                task={task}
                onEdit={onEdit}
              />
            </ViewContextProvider>
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
