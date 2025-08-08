import { useState, useEffect } from 'react';
import { User } from '@/utils/types';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3200';

interface UserProfileData {
  user: User | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useUserProfile = (userId: string): UserProfileData => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = Cookies.get('token');
      const response = await fetch(`${API_URL}/user/profile/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const userData = await response.json();
      setUser(userData);

    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId]);

  return {
    user,
    loading,
    error,
    refetch: fetchUser,
  };
};
