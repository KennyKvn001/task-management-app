import { TaskCard, type Task } from "./TaskCard";
import { ViewContextProvider } from "../context/ViewContext";
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
            <ViewContextProvider key={`assigned-${task.id}`} viewType="assigned">
              <TaskCard
                task={task}
                onEdit={onEdit}
              />
            </ViewContextProvider>
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
