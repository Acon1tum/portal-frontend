import { Business, VerificationStatus } from "@/utils/types";
import { Building, MessageSquare, Share2, Bookmark, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { ProfileImageEditor } from "@/components/custom-ui/profile/ProfileImageEditor";
import { useState, useEffect } from "react";

interface BusinessProfileHeaderProps {
  business: Business;
}

export default function BusinessProfileHeader({ business }: BusinessProfileHeaderProps) {
  const [profilePicture, setProfilePicture] = useState<string | undefined>(business.logo);
  const [coverPhoto, setCoverPhoto] = useState<string | undefined>(business.coverPhoto);

  // Update local state when business data changes
  useEffect(() => {
    setProfilePicture(business.logo);
    setCoverPhoto(business.coverPhoto);
  }, [business]);

  const handleImageUpdate = (type: 'profile' | 'cover', url: string) => {
    if (type === 'profile') {
      setProfilePicture(url);
    } else {
      setCoverPhoto(url);
    }
  };

  const getVerificationBadge = (status: VerificationStatus) => {
    switch (status) {
      case VerificationStatus.VERIFIED:
        return (
          <div className="flex items-center px-2 py-1 bg-chart-5/20 text-chart-5 rounded-full text-xs">
            <CheckCircle className="h-3 w-3 mr-1" />
            Verified
          </div>
        );
      case VerificationStatus.PENDING:
        return (
          <div className="flex items-center px-2 py-1 bg-chart-4/20 text-chart-4 rounded-full text-xs">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </div>
        );
      case VerificationStatus.UNVERIFIED:
        return (
          <div className="flex items-center px-2 py-1 bg-muted text-muted-foreground rounded-full text-xs">
            <AlertCircle className="h-3 w-3 mr-1" />
            Unverified
          </div>
        );
    }
  };

  return (
    <div className="relative">
      {/* Cover Photo and Profile Picture Editor */}
      <div className="relative">
        <ProfileImageEditor
          profilePicture={profilePicture}
          coverPhoto={coverPhoto}
          onUpdate={handleImageUpdate}
          isOrganization={true}
          organizationId={business.id}
        />
      </div>

      {/* Business Info Overlay */}
      <div className="absolute -bottom-16 left-8 flex items-end">
        <div className="ml-4 mb-4">
          <div className="flex items-center space-x-2">
            <h1 className="text-3xl font-bold text-white">{business.name}</h1>
            {getVerificationBadge(business.verificationStatus)}
          </div>
          <p className="text-white/90 flex items-center mt-1">
            <Building className="h-4 w-4 mr-1" />
            {business.industry}
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="absolute right-8 bottom-8 flex space-x-3">
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition flex items-center">
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