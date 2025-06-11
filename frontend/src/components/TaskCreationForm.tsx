import { useState, useEffect } from "react";
import { UserApi, type User } from "../services/UserApi";
import { useTask } from "../context/TaskContext";
import type { Task } from "./TaskCard";
import "../theme/taskCreationForm.css";

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
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  useEffect(() => {
    if (isOpen) {
      if (task) {
        setFormData({
          title: task.title,
          description: task.description || "",
          dueDate: task.dueDate.split('T')[0],
          assignedUserIds: [],
        });
      } else {
        setFormData({
          title: "",
          description: "",
          dueDate: "",
          assignedUserIds: [],
        });
      }

      fetchUsers();
    }
  }, [isOpen, task]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const userList = await UserApi.getAllUsers();

      const validUsers = Array.isArray(userList)
          ? userList.map(user => ({
            externalId: user.externalId,
            username: user.username
          }))
          : [];

      setUsers(validUsers);

      if (task && task.assignedTo) {
        const assigneeNames = task.assignedTo.split(',').map(name => name.trim());

        const matchingUsers = validUsers.filter(user =>
            assigneeNames.includes(user.username)
        );
        setSelectedUsers(matchingUsers);

        if (matchingUsers.length > 0) {
          const userIds = matchingUsers.map(user => user.externalId);
          setFormData(prev => ({
            ...prev,
            assignedUserIds: userIds
          }));
        }
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err instanceof Error ? err.message : "Failed to load users");
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }

    if (!formData.dueDate) {
      setError("Due date is required");
      return;
    }

    console.log("Submitting form with data:", formData);
    setError(null);
    setIsSaving(true);

    try {
      if (task) {
        await updateTask(task.id, formData);
      } else {
        await createTask(formData);
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

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = Number(e.target.value);
    if (!userId) return;

    const selectedUser = users.find(user => user.externalId === userId);
    if (!selectedUser) return;

    if (!formData.assignedUserIds.includes(userId)) {
      setSelectedUsers(prev => [...prev, selectedUser]);
      setFormData(prev => ({
        ...prev,
        assignedUserIds: [...prev.assignedUserIds, userId]
      }));
    }

    e.target.value = "";
  };

  const removeUser = (userId: number) => {
    setSelectedUsers(prev => prev.filter(user => user.externalId !== userId));
    setFormData(prev => ({
      ...prev,
      assignedUserIds: prev.assignedUserIds.filter(id => id !== userId)
    }));
  };

  const handleRemoveUserClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const userId = Number(e.currentTarget.dataset.userId);
    removeUser(userId);
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
                <label>Assign To</label>
                {isLoading ? (
                    <div className="loading-message">Loading users...</div>
                ) : users.length > 0 ? (
                    <>
                      <select
                          className="form-select"
                          onChange={handleSelectChange}
                          defaultValue=""
                          disabled={isSaving}
                      >
                        <option value="">Select a user</option>
                        {users.map((user) => (
                            <option key={user.externalId} value={user.externalId}>
                              {user.username}
                            </option>
                        ))}
                      </select>

                      {selectedUsers.length > 0 && (
                          <div className="selected-users-list">
                            <strong>Selected Users:</strong>
                            <ul>
                              {selectedUsers.map((user) => (
                                  <li key={user.externalId} className="selected-user-item">
                                    <span>{user.username}</span>
                                    <button
                                        type="button"
                                        className="remove-user-btn"
                                        onClick={handleRemoveUserClick}
                                        disabled={isSaving}
                                        data-user-id={user.externalId}
                                    >
                                      ×
                                    </button>
                                  </li>
                              ))}
                            </ul>
                          </div>
                      )}
                    </>
                ) : (
                    <div className="no-users-message">No users available</div>
                )}
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