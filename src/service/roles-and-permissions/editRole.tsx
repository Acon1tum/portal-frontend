import Cookies from 'js-cookie';

interface RoleData {
  name: string;
  permissionNames?: string[]; // Supports multiple permissions
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3200';

// Update the endpoint URL if your API route differs.
export const editRole = async (roleId: string, roleData: RoleData) => {
  try {
    const token = Cookies.get('token');
    const response = await fetch(`${API_URL}/roles/editRole/${roleId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(roleData),
    });

    if (!response.ok) {
      // Attempt to parse error response if available
      const text = await response.text();
      try {
        const errorData = JSON.parse(text);
        throw new Error(errorData.error || 'Failed to update role');
      } catch (parseError) {
        // If parsing fails, throw the raw text as error
        throw new Error(text);
      }
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating role:', error);
    throw error;
  }
};
