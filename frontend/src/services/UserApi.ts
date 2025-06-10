export interface User {
  id: number;
  username: string;
  email: string;
}

const API_BASE_URL = '/users';

export const UserApi = {
  getAllUsers: async (): Promise<User[]> => {
    const token = localStorage.getItem('token');
    const response = await fetch(API_BASE_URL, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.status}`);
    }

    return await response.json();
  },

  getUserById: async (id: number): Promise<User> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.status}`);
    }

    return await response.json();
  }
};
