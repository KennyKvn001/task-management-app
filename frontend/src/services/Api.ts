interface LoginRequest {
    email: string;
    password: string;
}

interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}

interface LoginResponse {
    token: string;
    username: string;
    role: string;
}

interface ApiError {
    error: string;
}

export interface UserData {
    username: string;
    email: string;
    role: string;
}

const API_BASE_URL = '/auth';

export const Api = {
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            const error: ApiError = await response.json();
            throw new Error(error.error);
        }

        return response.json();
    },

    register: async (userData: RegisterRequest): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const error: ApiError = await response.json();
            throw new Error(error.error);
        }
    },

};