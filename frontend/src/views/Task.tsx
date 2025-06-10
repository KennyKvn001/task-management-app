import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Header } from "../components/Header";
import { CreatedTasksSection } from "../components/CreatedTasksSection";
import { AssignedTasksSection } from "../components/AssignedTasksSection";
import { TaskCreationForm} from "../components/TaskCreationForm";
import '../theme/task.css';

interface Task {
  id: number;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
  dueDate: string; // ISO date string
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdBy: string;
  assignedTo: string;
}

export function Task() {
  const { username } = useAuth();
  const [createdTasks, setCreatedTasks] = useState<Task[]>([]);
  const [assignedTasks, setAssignedTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // In a real app, you would fetch tasks from your API
  useEffect(() => {
    // Mock data for demonstration purposes
    // In a real app, replace with API calls
    const mockTasks = [
      {
        id: 1,
        title: "Complete project proposal",
        description: "Draft the project proposal for client review",
        status: 'IN_PROGRESS' as const,
        dueDate: "2025-06-15T00:00:00",
        priority: 'HIGH' as const,
        createdBy: username || "current-user",
        assignedTo: username || "current-user"
      },
      {
        id: 2,
        title: "Review design mockups",
        description: "Check and provide feedback on the new UI designs",
        status: 'TODO' as const,
        dueDate: "2025-06-20T00:00:00",
        priority: 'MEDIUM' as const,
        createdBy: username || "current-user",
        assignedTo: "john.doe"
      },
      {
        id: 3,
        title: "Prepare weekly report",
        description: "Compile statistics and achievements for the weekly team meeting",
        status: 'TODO' as const,
        dueDate: "2025-06-12T00:00:00",
        priority: 'HIGH' as const,
        createdBy: "jane.smith",
        assignedTo: username || "current-user"
      }
    ];

    // Filter tasks created by the current user
    setCreatedTasks(mockTasks.filter(task => task.createdBy === (username || "current-user")));

    // Filter tasks assigned to the current user
    setAssignedTasks(mockTasks.filter(task => task.assignedTo === (username || "current-user")));

    setIsLoading(false);
  }, [username]);

  const handleCreateTask = () => {
    setShowCreateModal(true);
  };

  const handleSaveTask = (taskData: any) => {
    // In a real app, you would call an API to save the task
    const newTask: Task = {
      id: createdTasks.length + assignedTasks.length + 1,
      title: taskData.title,
      description: taskData.description,
      status: taskData.status as 'TODO' | 'IN_PROGRESS' | 'COMPLETED',
      dueDate: taskData.dueDate,
      priority: taskData.priority as 'LOW' | 'MEDIUM' | 'HIGH',
      createdBy: username || "current-user",
      assignedTo: username || "current-user"
    };

    setCreatedTasks(prev => [...prev, newTask]);
  };

  return (
    <div className="task-app-container">
      <Header />

      <div className="task-dashboard">
        <div className="task-dashboard-header">
          <h1>Task Dashboard</h1>
          <button className="create-task-btn" onClick={handleCreateTask}>
            Create New Task
          </button>
        </div>

        <div className="task-sections">
          <CreatedTasksSection tasks={createdTasks} isLoading={isLoading} />
          <AssignedTasksSection tasks={assignedTasks} isLoading={isLoading} />
        </div>

        <TaskCreationForm
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSave={handleSaveTask}
        />
      </div>
    </div>
  );
}
