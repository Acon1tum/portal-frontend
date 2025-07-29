import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3200';

export const fetchRoles = async () => {
  try {
    const token = Cookies.get('token');
    const response = await fetch(`${API_URL}/roles`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch roles');
    }
    return data;
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
};
