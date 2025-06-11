import { useState, useEffect, useRef } from "react";
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
  // Form refs for direct DOM access instead of controlled components
  const formRef = useRef<HTMLFormElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const dueDateRef = useRef<HTMLInputElement>(null);

  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  useEffect(() => {
    if (isOpen) {
      if (task) {
        if (titleRef.current) titleRef.current.value = task.title;
        if (descriptionRef.current) descriptionRef.current.value = task.description || "";
        if (dueDateRef.current) dueDateRef.current.value = task.dueDate.split('T')[0];

        setSelectedUsers([]);
      } else {
        if (formRef.current) formRef.current.reset();
        setSelectedUsers([]);
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

    // Extract values from refs
    const title = titleRef.current?.value.trim() || "";
    const description = descriptionRef.current?.value || "";
    const dueDate = dueDateRef.current?.value || "";
    const assignedUserIds = selectedUsers.map(user => user.externalId);

    // Validate required fields
    if (!title) {
      setError("Title is required");
      return;
    }

    if (!dueDate) {
      setError("Due date is required");
      return;
    }

    const formData: TaskFormData = {
      title,
      description,
      dueDate,
      assignedUserIds
    };

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

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = Number(e.target.value);
    if (!userId) return;

    const selectedUser = users.find(user => user.externalId === userId);
    if (!selectedUser) return;

    if (!selectedUsers.some(user => user.externalId === userId)) {
      setSelectedUsers(prev => [...prev, selectedUser]);
    }

    e.target.value = "";
  };

  const removeUser = (userId: number) => {
    setSelectedUsers(prev => prev.filter(user => user.externalId !== userId));
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
          <form ref={formRef} onSubmit={handleSubmit}>
            <div className="modal-content">
              {error && <div className="error-message">{error}</div>}

              <div className="form-group">
                <label htmlFor="title">Task Title</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    ref={titleRef}
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
                    ref={descriptionRef}
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
                    ref={dueDateRef}
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