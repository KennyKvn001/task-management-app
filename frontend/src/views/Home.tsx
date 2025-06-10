import { Link } from 'react-router-dom';
import '../theme/home.css';
import { Header } from '../components/Header';
import { useAuth } from '../context/AuthContext';

export function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-container">
      <Header />

      <main>
        <section className="hero-section">
          <div className="hero-content">
            <h1>Simplify Your Workflow</h1>
            <p>
              TaskMaster helps you organize, track, and manage your tasks
              efficiently. Boost your productivity and never miss a deadline.
            </p>
            <div className="cta-buttons">
              {isAuthenticated ? (
                <Link to="/tasks" className="btn btn-primary">My Tasks</Link>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary">Get Started</Link>
                  <Link to="/login" className="btn btn-secondary">Learn More</Link>
                </>
              )}
            </div>
          </div>
          <div className="hero-image">
            <img
              src="/src/assets/task-management.svg"
              alt="Task Management Illustration"
              onError={(e) => {
                e.currentTarget.src = "https://placehold.co/600x400?text=TaskMaster";
                e.currentTarget.onerror = null;
              }}
            />
          </div>
        </section>

        <section className="features-section">
          <h2>Key Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Task Organization</h3>
              <p>Create, categorize, and prioritize tasks with ease.</p>
            </div>
            <div className="feature-card">
              <h3>Progress Tracking</h3>
              <p>Monitor task completion status in real-time.</p>
            </div>
            <div className="feature-card">
              <h3>Deadline Management</h3>
              <p>Set reminders and never miss important deadlines.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <p>&copy; {new Date().getFullYear()} TaskMaster. All rights reserved.</p>
      </footer>
    </div>
  );
}
