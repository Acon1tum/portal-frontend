import { Business, VerificationStatus } from "@/utils/types";
import { Building, MessageSquare, Share2, Bookmark, CheckCircle, Clock, AlertCircle, Edit } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface BusinessProfileHeaderProps {
  business: Business;
}

export default function BusinessProfileHeader({ business }: BusinessProfileHeaderProps) {
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
    <div className="relative h-64 w-full overflow-hidden">
      {/* Cover photo or gradient background */}
      {business.coverPhoto && business.coverPhoto.startsWith('data:image/') ? (
        <Image
          src={business.coverPhoto}
          alt="Cover photo"
          fill
          className="object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-r from-chart-1/90 to-chart-3/90" />
      )}
      
      {/* Business info section - positioned to avoid overlap */}
      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
        <div className="flex items-end space-x-4">
          {/* Logo container */}
          <div className="w-24 h-24 bg-card rounded-lg shadow-lg overflow-hidden border-4 border-background flex-shrink-0">
            {business.logo && business.logo.startsWith('data:image/') ? (
              <Image
                src={business.logo}
                alt={`${business.name} logo`}
                fill
                className="object-cover"
              />
            ) : business.logo && business.logo.startsWith('/') ? (
              <div className="w-full h-full flex items-center justify-center bg-accent text-accent-foreground text-2xl font-bold">
                {business.name.charAt(0)}
              </div>
            ) : business.logo ? (
              <Image
                src={business.logo}
                alt={`${business.name} logo`}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-accent text-accent-foreground text-2xl font-bold">
                {business.name.charAt(0)}
              </div>
            )}
          </div>
          
          {/* Business details */}
          <div className="flex flex-col space-y-2 min-w-0">
            <div className="flex items-center space-x-2 flex-wrap">
              <h1 className="text-2xl font-bold text-white truncate">{business.name}</h1>
              {getVerificationBadge(business.verificationStatus)}
            </div>
            <p className="text-white/90 flex items-center text-sm">
              <Building className="h-4 w-4 mr-1 flex-shrink-0" />
              <span className="truncate">{business.industry}</span>
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex space-x-2 flex-shrink-0">
          <Link href={`/owner/business-profile/${business.id}/edit`}>
            <Button variant="secondary" size="sm" className="gap-2">
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          </Link>
          <button className="px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition flex items-center text-sm">
            <MessageSquare className="h-4 w-4 mr-1" />
            Message
          </button>
          <button className="p-2 bg-card/30 backdrop-blur-sm text-white rounded-lg hover:bg-card/50 transition">
            <Share2 className="h-4 w-4" />
          </button>
          <button className="p-2 bg-card/30 backdrop-blur-sm text-white rounded-lg hover:bg-card/50 transition">
            <Bookmark className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}