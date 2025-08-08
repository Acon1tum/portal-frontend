"use client";

import { useAuth } from '@/service/authMiddleware';
import { useAddUserDevice } from '@/service/user-profile/addDevice';
import { useUserProfile } from '@/service/user-profile/userProfile';
import { ProfileImageEditor } from '@/components/custom-ui/profile/ProfileImageEditor';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner'; // using Sonner's toast API
import { useState, useEffect } from 'react';

const UserProfile = () => {
  const { user, loading: authLoading, error: authError } = useAuth();
  const userId = user?.userId || "";
  const { profile, loading: profileLoading, error: profileError } = useUserProfile(userId);
  const { addDevice, loading: deviceLoading, error: deviceError } = useAddUserDevice();
  const [isSaving, setIsSaving] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | undefined>(profile?.profilePicture);
  const [coverPhoto, setCoverPhoto] = useState<string | undefined>(profile?.coverPhoto);

  // Update local state when profile data changes
  useEffect(() => {
    if (profile) {
      setProfilePicture(profile.profilePicture);
      setCoverPhoto(profile.coverPhoto);
    }
  }, [profile]);

  const handleImageUpdate = (type: 'profile' | 'cover', url: string) => {
    if (type === 'profile') {
      setProfilePicture(url);
    } else {
      setCoverPhoto(url);
    }
  };

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
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left sidebar with profile information */}
        <div className="space-y-6">
          {/* Profile card with image editor */}
          <Card className="overflow-hidden border-none shadow-md dark:bg-gray-800 dark:text-gray-100">
            {/* Image Editor Section */}
            <div className="relative">
              <ProfileImageEditor
                profilePicture={profilePicture}
                coverPhoto={coverPhoto}
                onUpdate={handleImageUpdate}
              />
            </div>
            
            {/* Profile Info Section */}
            <CardContent className="px-6 py-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold">{profile.name ? profile.name : profile.email}</h2>
                <p className="text-gray-500 dark:text-gray-400">User Profile</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <span className="font-medium">Email:</span>
                  <span className="ml-2">{profile.email}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium">Sex:</span>
                  <span className="ml-2">{profile.sex}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium">Role:</span>
                  <span className="ml-2">{profile.role.name}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right sidebar with accounts and devices */}
        <div className="md:col-span-2 space-y-6">
          {/* Accounts Section */}
          <Card>
            <CardHeader>
              <CardTitle>Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              {profile.accounts.map(account => (
                <div key={account.id} className="mb-4 p-4 border rounded-lg">
                  <h3 className="font-semibold">Account ID: {account.accountId}</h3>
                  <p><strong>Status:</strong> {account.status}</p>
                  <p><strong>Created At:</strong> {account.createdAt}</p>
                  <p><strong>Updated At:</strong> {account.updatedAt}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Devices Section */}
          <Card>
            <CardHeader>
              <CardTitle>Devices</CardTitle>
            </CardHeader>
            <CardContent>
              {profile.devices.map(device => (
                <div key={device.id} className="mb-4 p-4 border rounded-lg">
                  <p><strong>Device IP:</strong> {device.deviceIp}</p>
                  <p><strong>Browser:</strong> {device.browser}</p>
                  <p><strong>Timestamp:</strong> {device.timestamp}</p>
                </div>
              ))}

              <Button 
                variant="default" 
                onClick={handleSaveDevice} 
                disabled={deviceLoading || isSaving}
                className="mt-4"
              >
                {deviceLoading || isSaving ? 'Saving...' : 'Save this device'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
