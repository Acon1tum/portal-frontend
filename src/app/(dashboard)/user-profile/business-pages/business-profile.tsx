import { Business, VerificationStatus } from "@/utils/types";
import { Building, MessageSquare, Share2, Bookmark, CheckCircle, Clock, AlertCircle } from "lucide-react";
import Image from "next/image";

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
      
      <div className="absolute -bottom-16 left-8 flex items-end">
        <div className="w-32 h-32 bg-card rounded-lg shadow-lg overflow-hidden border-4 border-background">
          {business.logo && business.logo.startsWith('data:image/') ? (
            <Image
              src={business.logo}
              alt={`${business.name} logo`}
              fill
              className="object-cover"
            />
          ) : business.logo && business.logo.startsWith('/') ? (
            <div className="w-full h-full flex items-center justify-center bg-accent text-accent-foreground text-4xl font-bold">
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
            <div className="w-full h-full flex items-center justify-center bg-accent text-accent-foreground text-4xl font-bold">
              {business.name.charAt(0)}
            </div>
          )}
        </div>
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