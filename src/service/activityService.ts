export interface RecentActivity {
  id: string;
  business: string;
  action: string;
  time: string;
  type?: 'business_update' | 'new_connection' | 'verification' | 'registration';
  businessId?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3200';

// Fetch recent activities
export const fetchRecentActivities = async (): Promise<RecentActivity[]> => {
  try {
    const response = await fetch(`${API_URL}/activities/recent`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      // If the endpoint doesn't exist, return empty array for now
      if (response.status === 404) {
        console.warn('Recent activities endpoint not found, returning empty array');
        return [];
      }
      throw new Error(`Failed to fetch recent activities: ${response.status}`);
    }

    const data = await response.json();
    return data.activities || data || [];
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    // Return empty array on error to prevent breaking the UI
    return [];
  }
};

// Fetch user-specific activities
export const fetchUserActivities = async (userId: string): Promise<RecentActivity[]> => {
  try {
    const response = await fetch(`${API_URL}/activities/user/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.warn('User activities endpoint not found, returning empty array');
        return [];
      }
      throw new Error(`Failed to fetch user activities: ${response.status}`);
    }

    const data = await response.json();
    return data.activities || data || [];
  } catch (error) {
    console.error('Error fetching user activities:', error);
    return [];
  }
};

// Create a new activity (for future use)
export const createActivity = async (activity: Omit<RecentActivity, 'id' | 'time'>): Promise<RecentActivity> => {
  try {
    const response = await fetch(`${API_URL}/activities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(activity),
    });

    if (!response.ok) {
      throw new Error(`Failed to create activity: ${response.status}`);
    }

    const data = await response.json();
    return data.activity || data;
  } catch (error) {
    console.error('Error creating activity:', error);
    throw error;
  }
}; 