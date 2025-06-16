import {createContext, useState, useContext, type ReactNode, useMemo} from 'react';
import { Api } from '../services/Api';

interface AuthContextType {
    token: string | null;
    username: string | null;
    role: string | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [username, setUsername] = useState<string | null>(localStorage.getItem('username'));
    const [role, setRole] = useState<string | null>((localStorage.getItem('role'))
    );

    const isAuthenticated = !!token && !!username && !!role && role === 'USER';

    const login = async (email: string, password: string) => {
        const response = await Api.login({ email, password });

        localStorage.setItem('token', response.token);
        localStorage.setItem('username', response.username);
        localStorage.setItem('role', response.role);

        setToken(response.token);
        setUsername(response.username);
        setRole(response.role);
    };

    const register = async (username: string, email: string, password: string) => {
        await Api.register({ username, email, password });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('role');

        setToken(null);
        setUsername(null);
        setRole(null);
    };
    const contextValue = useMemo(() => ({
        token, username, role, isAuthenticated, login, register, logout
    }), [token, username, role, isAuthenticated]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}