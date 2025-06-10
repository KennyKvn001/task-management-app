import "../theme/register.css"
import { Form } from "../components/AuthForm.tsx";
import {Link} from "react-router-dom";

export function Register() {
    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Create Account</h2>
                <Form type="register" />
                <p className="auth-footer">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    )
}