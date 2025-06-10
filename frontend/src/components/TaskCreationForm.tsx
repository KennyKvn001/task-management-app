import { useState, useEffect } from "react";
import { UserApi, type User } from "../services/UserApi";
import { useTask } from "../context/TaskContext";
import type {Task} from "./TaskCard";
import "../theme/task.css";

interface TaskFormData {
  title: string;
  description: string;
  dueDate: string;
  assignedUserIds: number[];
}

interface TaskCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task;
}

export function TaskCreationForm({ isOpen, onClose, task }: TaskCreationModalProps) {
  const { createTask, updateTask } = useTask();
  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    description: "",
    dueDate: "",
    assignedUserIds: [],
  });
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (task) {

        setFormData({
          title: task.title,
          description: task.description,
          dueDate: task.dueDate.split('T')[0],
          assignedUserIds: [],
        });
        setSelectedUserId("");
      } else {
        setFormData({
          title: "",
          description: "",
          dueDate: "",
          assignedUserIds: [],
        });
        setSelectedUserId("");
      }

      fetchUsers();
    }
  }, [isOpen, task]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const userList = await UserApi.getAllUsers();
      setUsers(userList || []); // Ensure we have at least an empty array

      // If editing, find and set the assigned user's ID
      if (task && task.assignedTo) {
        const assigneeNames = task.assignedTo.split(',').map(name => name.trim());
        const matchingUser = userList.find(user => assigneeNames.includes(user.username));

        if (matchingUser && matchingUser.id) {
          const userId = String(matchingUser.id);
          console.log("Setting selected user ID:", userId);
          setSelectedUserId(userId);
          setFormData(prev => ({
            ...prev,
            assignedUserIds: [matchingUser.id]
          }));
        }
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err instanceof Error ? err.message : "Failed to load users");
      setUsers([]); // Ensure users is always an array
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submission - selected user:", selectedUserId);
    console.log("Current form data:", formData);

    // Basic validation
    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }

    if (!formData.dueDate) {
      setError("Due date is required");
      return;
    }

    // Create a copy of the form data with validated assignedUserIds
    const taskData = {
      ...formData,
      // Filter out any null/invalid values and ensure it's an array
      assignedUserIds: selectedUserId && !isNaN(parseInt(selectedUserId)) ? [parseInt(selectedUserId)] : []
    };

    console.log("Submitting task with data:", taskData);
    setError(null);
    setIsSaving(true);

    try {
      if (task) {
        // Update existing task
        await updateTask(task.id, taskData);
      } else {
        // Create new task
        await createTask(taskData);
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save task");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUserSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    console.log("User selection changed to:", value);
    setSelectedUserId(value);

    // Only add the ID to assignedUserIds if it's a valid value
    if (value && !isNaN(parseInt(value))) {
      const userId = parseInt(value);
      setFormData(prev => ({
        ...prev,
        assignedUserIds: [userId]
      }));
    } else {
      // Clear assignedUserIds if no selection
      setFormData(prev => ({
        ...prev,
        assignedUserIds: []
      }));
    }
  };


  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="task-modal">
        <div className="modal-header">
          <h2>{task ? 'Edit Task' : 'Create New Task'}</h2>
          <button
            className="close-modal-btn"
            onClick={onClose}
            disabled={isSaving}
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-content">
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label htmlFor="title">Task Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                disabled={isSaving}
                placeholder="Enter task title"
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                disabled={isSaving}
                placeholder="Enter task description"
                rows={3}
              />
            </div>
            <div className="form-group">
              <label htmlFor="dueDate">Due Date</label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                required
                disabled={isSaving}
              />
            </div>
            <div className="form-group">
              <label htmlFor="assignedUsers">Assign To</label>
              <select
                id="assignedUsers"
                name="assignedUsers"
                className="form-select"
                onChange={handleUserSelection}
                disabled={isLoading || isSaving}
                value={selectedUserId}
              >
                <option value="">Select user</option>
                {isLoading ? (
                  <option value="" disabled>Loading users...</option>
                ) : users && users.length > 0 ? (
                  users.map(user => (
                    <option
                      value={user.id !== undefined ? String(user.id) : ""}
                    >
                      {user.username}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>No users available</option>
                )}
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="save-btn"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : (task ? 'Update Task' : 'Create Task')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
