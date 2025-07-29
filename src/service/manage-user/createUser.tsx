// manage-user/createUser.ts
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3200';

export const createUser = async (userData: {
  email: string;
  name?: string;
  sex: 'MALE' | 'FEMALE';
  roleId: string;
  account: {
    accountId: string;
    providerId: string;
    password?: string;
    accessToken?: string;
    refreshToken?: string;
    idToken?: string;
    accessTokenExpiresAt?: string; // Use ISO date strings
    refreshTokenExpiresAt?: string; // Use ISO date strings
    scope?: string;
  };
}) => {
  try {
    const token = Cookies.get('token');
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create user');
    }
    return data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};
