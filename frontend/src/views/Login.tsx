import "../theme/register.css"
import { Form } from "../components/AuthForm.tsx";
import {Link} from "react-router-dom";

export function Login() {
    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Welcome Back</h2>
                <p className="auth-subtitle">Sign in to your account</p>
                <Form type="login" />
                <p className="auth-footer">
                    Don't have an account? <Link to="/register">Register</Link>
                </p>
            </div>
        </div>
    )
}