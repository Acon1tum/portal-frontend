import { User, UserRole, UserType, CurrentJobStatus } from "@/utils/types";
import { User as UserIcon, MessageSquare, Share2, Bookmark, CheckCircle, Clock, AlertCircle, Mail, MapPin, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { navigateToChatWithUser } from "@/utils/chat-utils";
import { ProfileImageEditor } from "@/components/custom-ui/profile/ProfileImageEditor";
import { useState, useEffect } from "react";

interface UserProfileHeaderProps {
  user: User;
}

export default function UserProfileHeader({ user }: UserProfileHeaderProps) {
  const router = useRouter();
  const [profilePicture, setProfilePicture] = useState<string | undefined>(user.profilePicture);
  const [coverPhoto, setCoverPhoto] = useState<string | undefined>(user.coverPhoto);

  // Update local state when user data changes
  useEffect(() => {
    setProfilePicture(user.profilePicture);
    setCoverPhoto(user.coverPhoto);
  }, [user]);

  const handleImageUpdate = (type: 'profile' | 'cover', url: string) => {
    if (type === 'profile') {
      setProfilePicture(url);
    } else {
      setCoverPhoto(url);
    }
  };

  const handleMessageClick = () => {
    navigateToChatWithUser(user, router);
  };

  const getVerificationBadge = (isVerified: boolean) => {
    if (isVerified) {
      return (
        <div className="flex items-center px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
          <CheckCircle className="h-3 w-3 mr-1" />
          Verified
        </div>
      );
    } else {
      return (
        <div className="flex items-center px-2 py-1 bg-muted text-muted-foreground rounded-full text-xs">
          <AlertCircle className="h-3 w-3 mr-1" />
          Unverified
        </div>
      );
    }
  };

  const getRoleBadge = (role: UserRole) => {
    const roleColors = {
      [UserRole.VISITOR]: "bg-blue-100 text-blue-800",
      [UserRole.JOBSEEKER]: "bg-green-100 text-green-800",
      [UserRole.MANNING_AGENCY]: "bg-purple-100 text-purple-800",
      [UserRole.SUPERADMIN]: "bg-red-100 text-red-800",
      [UserRole.EXHIBITOR]: "bg-orange-100 text-orange-800",
      [UserRole.SPONSOR]: "bg-yellow-100 text-yellow-800",
    };

    return (
      <div className={`flex items-center px-2 py-1 rounded-full text-xs ${roleColors[role] || "bg-gray-100 text-gray-800"}`}>
        <UserIcon className="h-3 w-3 mr-1" />
        {role.replace(/_/g, ' ')}
      </div>
    );
  };

  return (
    <div className="relative">
      {/* Cover Photo and Profile Picture Editor */}
      <div className="relative">
        <ProfileImageEditor
          profilePicture={profilePicture}
          coverPhoto={coverPhoto}
          onUpdate={handleImageUpdate}
          isOrganization={false}
          readOnly={true}
        />
      </div>

      {/* User Info Overlay */}
      <div className="absolute -bottom-16 left-8 flex items-end">
        <div className="ml-4 mb-4">
          <div className="flex items-center space-x-2">
            <h1 className="text-3xl font-bold text-white">{user.name || "Anonymous User"}</h1>
            {getVerificationBadge(user.isEmailVerified)}
          </div>
          <div className="flex items-center space-x-2 mt-1">
            {getRoleBadge(user.role)}
            {user.userType && (
              <div className="flex items-center px-2 py-1 bg-white/20 text-white rounded-full text-xs">
                {user.userType.replace(/_/g, ' ')}
              </div>
            )}
          </div>
          <div className="flex items-center text-white/90 mt-2">
            <Mail className="h-4 w-4 mr-1" />
            {user.email}
          </div>
          {user.currentJobStatus && (
            <div className="flex items-center text-white/90 mt-1">
              <UserIcon className="h-4 w-4 mr-1" />
              {user.currentJobStatus.replace(/_/g, ' ')}
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="absolute right-8 bottom-8 flex space-x-3">
        <button 
          onClick={handleMessageClick}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition flex items-center"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Message
        </button>
        <button className="p-2 bg-card/30 backdrop-blur-sm text-white rounded-lg hover:bg-card/50 transition">
          <Share2 className="h-5 w-5" />
        </button>
        <button className="p-2 bg-card/30 backdrop-blur-sm text-white rounded-lg hover:bg-card/50 transition">
          <Bookmark className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
