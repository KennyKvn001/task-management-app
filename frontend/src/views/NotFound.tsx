import "../theme/notFound.css"
import { Link } from "react-router-dom"

export function NotFound() {
    return (
        <div className="not-found-container">
            <div className="not-found-content">
                <h1>404</h1>
                <h2>Page Not Found</h2>
                <p>The page you're looking for doesn't exist or has been moved.</p>
                <Link to="/login" className="back-link">Go to Login</Link>
            </div>
        </div>
    )
}