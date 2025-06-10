import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../theme/header.css';

export function Header() {
  const { isAuthenticated, username, role, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(prev => !prev);
  };

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  return (
    <header className="app-header">
      <div className="logo">
        <Link to="/">
          <h2>TaskMaster</h2>
        </Link>
      </div>
      <nav className="nav-buttons">
        {isAuthenticated ? (
          <div className="user-profile-container">
            <div className="user-profile" onClick={toggleDropdown}>
              <span className="user-icon">{username?.[0]?.toUpperCase() || '?'}</span>
              <span className="username">{username}</span>
            </div>
            {showDropdown && (
              <div className="profile-dropdown">
                <div className="role-status">
                  <p>Role: <span className="role-badge">{role || 'User'}</span></p>
                </div>
                <div className="dropdown-links">
                  <Link to="/tasks" className="dropdown-link">My Tasks</Link>
                </div>
                <button onClick={handleLogout} className="logout-button">Logout</button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login" className="btn btn-login">Login</Link>
            <Link to="/register" className="btn btn-register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
