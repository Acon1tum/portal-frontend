"use client";

import { useState, useEffect } from 'react';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3200';

interface Device {
  id: string;
  deviceIp: string;
  browser: string;
  timestamp: string;
  userId: string;
}

interface Account {
  id: string;
  accountId: string;
  providerId: string;
  userId: string;
  password?: string;
  accessToken?: string;
  refreshToken?: string;
  idToken?: string;
  accessTokenExpiresAt?: string;
  refreshTokenExpiresAt?: string;
  scope?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface Role {
  id: string;
  name: string;
  // Add other role fields if needed
}

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  sex: string;
  roleId: string;
  accounts: Account[];
  devices: Device[];
  role: Role;
}

interface UseUserProfileState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

export const useUserProfile = (userId: string) => {
  const [state, setState] = useState<UseUserProfileState>({
    profile: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_URL}/user/profile/${userId}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch user profile');
        }
        const data = await response.json();
        setState({
          profile: data,
          loading: false,
          error: null,
        });
      } catch (error) {
        setState({
          profile: null,
          loading: false,
          error: error instanceof Error ? error.message : 'An unknown error occurred',
        });
      }
    };

    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  return state;
};
