import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTask } from "../context/TaskContext";
import "../theme/upcomingTasks.css";

export function UpcomingTasks() {
  const { username, isAuthenticated } = useAuth();
  const { createdTasks, assignedTasks, isLoading } = useTask();

  // Calculate tasks due in the next 7 days
  const upcomingTasks = useMemo(() => {
    if (!isAuthenticated) return [];

    const today = new Date();
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(today.getDate() + 7);

    // Combine created and assigned tasks
    const allUserTasks = [...createdTasks, ...assignedTasks];

    // Filter tasks:
    // 1. Not completed
    // 2. Due within the next 7 days
    // 3. Assigned to the current user
    return allUserTasks.filter((task) => {
      const dueDate = new Date(task.dueDate);
      const isUpcoming = dueDate >= today && dueDate <= sevenDaysLater;
      const isIncomplete = task.status !== 'COMPLETED';
      const isUserTask = task.assignedTo.includes(username || '');

      return isUpcoming && isIncomplete && isUserTask;
    });
  }, [createdTasks, assignedTasks, isAuthenticated, username]);

  // Format date to a readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!isAuthenticated) return null;

  return (
    <section className="upcoming-tasks-section">
      <h2>Coming Soon</h2>
      <p className="section-description">Tasks due in the next 7 days</p>

      {isLoading ? (
        <div className="loading-message">Loading upcoming tasks...</div>
      ) : upcomingTasks.length > 0 ? (
        <div className="upcoming-tasks-list">
          {upcomingTasks.map((task) => (
            <div key={task.id} className="upcoming-task-item">
              <div className="upcoming-task-title">{task.title}</div>
              <div className="upcoming-task-due">Due: {formatDate(task.dueDate)}</div>
            </div>
          ))}
          <div className="view-all-tasks">
            <Link to="/tasks">View all tasks →</Link>
          </div>
        </div>
      ) : (
        <div className="no-upcoming-tasks">
          No tasks due in the next 7 days.
        </div>
      )}
    </section>
  );
}
