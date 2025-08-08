import { useState, useEffect } from 'react';
import { User } from '@/utils/types';
import { fetchUsers } from '@/service/manage-user/user';

interface UsersData {
  users: User[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useUsersData = (): UsersData => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const usersData = await fetchUsers();
      setUsers(usersData);

    } catch (err) {
      console.error('Error fetching users data:', err);
      setError('Failed to load users data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    users,
    loading,
    error,
    refetch: fetchData,
  };
};
