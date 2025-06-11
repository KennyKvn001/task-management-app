import "../theme/authForm.css";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function Form({ type = "login" }) {
    const formRef = useRef<HTMLFormElement>(null);
    const navigate = useNavigate();
    const { login, register } = useAuth();
    const isLogin = type === "login";
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!formRef.current) return;

        try {
            const formData = new FormData(formRef.current);
            const email = formData.get("email") as string;
            const password = formData.get("password") as string;

            if (isLogin) {
                await login(email, password);
                navigate("/");
            } else {
                const username = formData.get("username") as string;
                await register(username, email, password);
                navigate("/login");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        }
    };

    return (
        <form ref={formRef} className="form" onSubmit={handleSubmit}>
            <fieldset className="form-fieldset">
                <legend className="form-legend">
                    {isLogin ? "Login Information" : "Registration Information"}
                </legend>
                {!isLogin && (
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Enter your username"
                            required
                        />
                    </div>
                )}
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                        required
                    />
                </div>
                {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
            </fieldset>
            <button type="submit" className="submit-btn">
                {isLogin ? "Login" : "Register"}
            </button>
        </form>
    );
}