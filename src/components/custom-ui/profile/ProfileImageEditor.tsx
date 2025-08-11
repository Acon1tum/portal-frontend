'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ImageUploadModal } from './ImageUploadModal';
import { ImageUploadService } from '@/service/imageUploadService';
import { Camera, Edit3, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';

interface ProfileImageEditorProps {
  profilePicture?: string;
  coverPhoto?: string;
  onUpdate: (type: 'profile' | 'cover', url: string) => void;
  isOrganization?: boolean;
  organizationId?: string;
  readOnly?: boolean;
}

export function ProfileImageEditor({
  profilePicture,
  coverPhoto,
  onUpdate,
  isOrganization = false,
  organizationId,
  readOnly = false
}: ProfileImageEditorProps) {
  const { user } = useAuth();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Helper function to check if an image is valid
  const isValidImage = (imageUrl?: string) => {
    return imageUrl && (imageUrl.startsWith('data:image/') || imageUrl.startsWith('http'));
  };

  // Debug logging for image data
  console.log('ProfileImageEditor - Profile picture:', {
    hasImage: !!profilePicture,
    type: profilePicture?.startsWith('data:image/') ? 'base64' : 'url',
    length: profilePicture?.length
  });
  console.log('ProfileImageEditor - Cover photo:', {
    hasImage: !!coverPhoto,
    type: coverPhoto?.startsWith('data:image/') ? 'base64' : 'url',
    length: coverPhoto?.length
  });

  const handleImageSuccess = async (type: 'profile' | 'cover', url: string) => {
    console.log('Image upload success, saving to database:', { type, urlLength: url?.length, userId: user?.id });
    setIsUpdating(true);
    
    try {
      // Test backend connection first
      const backendConnected = await ImageUploadService.testBackendConnection();
      if (!backendConnected) {
        toast.error('Cannot connect to server. Please try again.');
        return;
      }
      
      let result;
      
      if (isOrganization && organizationId) {
        console.log('Updating organization profile');
        result = await ImageUploadService.updateOrganizationProfile(organizationId, {
          [type === 'profile' ? 'profilePicture' : 'coverPhoto']: url
        });
      } else if (user?.id) {
        console.log('Updating user profile, ID:', user.id);
        result = await ImageUploadService.updateUserProfile(user.id, {
          [type === 'profile' ? 'profilePicture' : 'coverPhoto']: url
        });
      } else {
        console.error('No user ID or organization ID found');
        toast.error('User information not found');
        return;
      }

      if (result?.success) {
        console.log('Profile update successful');
        onUpdate(type, url);
        toast.success(`${type === 'profile' ? 'Profile picture' : 'Cover photo'} saved successfully!`);
      } else {
        console.error('Profile update failed:', result?.error);
        toast.error(result?.error || 'Failed to save image');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to save image. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <>
      {/* Cover Photo Section */}
      <div className="relative w-full h-48 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 rounded-lg overflow-hidden">
        {isValidImage(coverPhoto) ? (
          <Image
            src={coverPhoto}
            alt="Cover photo"
            fill
            className="object-cover"
            onError={(e) => {
              console.error('Error loading cover photo:', e);
              // Fallback to default background
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="h-12 w-12 text-gray-400" />
          </div>
        )}
        
        {/* Cover Photo Edit Button */}
        {!readOnly && (
          <Button
            variant="secondary"
            size="sm"
            className="absolute top-4 right-4 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 backdrop-blur-sm"
            onClick={() => setIsCoverModalOpen(true)}
            disabled={isUpdating}
          >
            <Edit3 className="h-4 w-4 mr-1" />
            Edit Cover
          </Button>
        )}
      </div>

      {/* Profile Picture Section */}
      <div className="relative -mt-16 ml-6">
        <div className="relative">
          <Avatar className="h-32 w-32 ring-4 ring-white dark:ring-gray-800">
            {isValidImage(profilePicture) ? (
              <AvatarImage 
                src={profilePicture} 
                alt="Profile picture"
                onError={(e) => {
                  console.error('Error loading profile picture:', e);
                  // Will fallback to AvatarFallback
                }}
              />
            ) : (
              <AvatarImage src={undefined as unknown as string} alt="Profile picture" />
            )}
            <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl font-semibold dark:bg-gray-600 dark:text-gray-200">
              {getInitials(user?.name)}
            </AvatarFallback>
          </Avatar>
          
          {/* Profile Picture Edit Button */}
          {!readOnly && (
            <Button
              variant="secondary"
              size="sm"
              className="absolute bottom-0 right-0 bg-white dark:bg-gray-800 border-2 border-white dark:border-gray-800 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => setIsProfileModalOpen(true)}
              disabled={isUpdating}
            >
              <Camera className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Profile Picture Upload Modal */}
      <ImageUploadModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSuccess={(url) => handleImageSuccess('profile', url)}
        type="profile"
        currentImage={isValidImage(profilePicture) ? profilePicture : undefined}
        title="Update Profile Picture"
        description="Upload a new profile picture. Recommended size: 400x400 pixels."
        aspectRatio="square"
      />

      {/* Cover Photo Upload Modal */}
      <ImageUploadModal
        isOpen={isCoverModalOpen}
        onClose={() => setIsCoverModalOpen(false)}
        onSuccess={(url) => handleImageSuccess('cover', url)}
        type="cover"
        currentImage={isValidImage(coverPhoto) ? coverPhoto : undefined}
        title="Update Cover Photo"
        description="Upload a new cover photo. Recommended size: 1200x400 pixels."
        aspectRatio="wide"
      />
    </>
  );
}
