// hooks/useAddUserDevice.ts
'use client';

import { useState, useCallback } from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { useAuth } from '@/app/service/authMiddleware';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3200';

interface Device {
  id: string;
  deviceIp: string;
  browser: string;
  timestamp: string;
  userId: string;
}

interface AddDeviceResponse {
  device: Device;
}

export const useAddUserDevice = () => {
  const { user } = useAuth(); // Retrieve the authenticated user
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addDevice = useCallback(async () => {
    setLoading(true);
    setError(null);
    console.log(user);
    try {
      // Ensure there is an authenticated user with a valid user id
      if (!user || !user.userId) {
        throw new Error('User is not authenticated or user id is missing');
      }

      // Load the FingerprintJS library and get the visitor data
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      const visitorId = result.visitorId;

      // Extract the browser information from the userAgent component.
      // Note: result.components.userAgent.value returns the full user agent string.
      const browser = navigator.userAgent;


      // Optionally, you can parse the user agent string further to extract just the browser name.
      // For example:
      // const browserName = parseUserAgent(browser);

      // Send the visitorId and browser info to the backend along with the userId in a custom header.
      const response = await fetch(`${API_URL}/user/devices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.userId, // Passing the user ID manually
        },
        credentials: 'include', // Include cookies if needed
        body: JSON.stringify({ visitorId, browser }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add device');
      }

      const data: AddDeviceResponse = await response.json();
      return data.device;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  return { addDevice, loading, error };
};
