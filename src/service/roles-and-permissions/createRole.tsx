import Cookies from 'js-cookie';

interface RoleData {
  name: string;
  permissionNames?: string[]; // Now supports multiple permissions
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3200';

export const createRole = async (roleData: RoleData) => {
  try {
    const token = Cookies.get('token');
    const response = await fetch(`${API_URL}/roles/createRole`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(roleData),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create role');
    }
    return data;
  } catch (error) {
    console.error('Error creating role:', error);
    throw error;
  }
};
