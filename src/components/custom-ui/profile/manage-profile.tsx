"use client";

import { useAuth } from '@/service/authMiddleware';
import { useAddUserDevice } from '@/service/user-profile/addDevice';
import { useUserProfile } from '@/service/user-profile/userProfile';

import { Button } from '@/components/ui/button';
import { toast } from 'sonner'; // using Sonner's toast API
import { useState } from 'react';

const UserProfile = () => {
  const { user, loading: authLoading, error: authError } = useAuth();
  const userId = user?.userId || "";
  const { profile, loading: profileLoading, error: profileError } = useUserProfile(userId);
  const { addDevice, loading: deviceLoading, error: deviceError } = useAddUserDevice();
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveDevice = async () => {
    setIsSaving(true);
    const device = await addDevice();

    if (device) {
      toast.success('Device saved successfully!');
    } else {
      toast.error(deviceError || 'Failed to save device');
    }

    setIsSaving(false);
  };

  if (authLoading || profileLoading) {
    return <div>Loading...</div>;
  }

  if (authError) {
    return <div>Error: {authError}</div>;
  }

  if (profileError) {
    return <div>Error: {profileError}</div>;
  }

  if (!profile) {
    return <div>No profile found.</div>;
  }

  return (
    <div>
      <h1>User Profile</h1>
      <h2>{profile.name ? profile.name : profile.email}</h2>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Sex:</strong> {profile.sex}</p>
      <p><strong>Role:</strong> {profile.role.name}</p>

      <h2>Accounts</h2>
      {profile.accounts.map(account => (
        <div key={account.id} style={{ marginBottom: '1rem' }}>
          <h3>Account ID: {account.accountId}</h3>
          <p><strong>Status:</strong> {account.status}</p>
          <p><strong>Created At:</strong> {account.createdAt}</p>
          <p><strong>Updated At:</strong> {account.updatedAt}</p>
          <h4>Devices</h4>
        </div>
      ))}

      {profile.devices.map(device => (
        <div key={device.id} style={{ marginBottom: '1rem' }}>
          <p><strong>Device IP:</strong> {device.deviceIp}</p>
          <p><strong>Browser:</strong> {device.browser}</p>
          <p><strong>Timestamp:</strong> {device.timestamp}</p>
        </div>
      ))}

      <Button variant="default" onClick={handleSaveDevice} disabled={deviceLoading || isSaving}>
        {deviceLoading || isSaving ? 'Saving...' : 'Save this device'}
      </Button>
    </div>
  );
};

export default UserProfile;
