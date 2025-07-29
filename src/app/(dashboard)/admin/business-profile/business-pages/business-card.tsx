import { Business, VerificationStatus } from "@/utils/types";
import { Building, MapPin, CheckCircle, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";

interface BusinessCardProps {
  business: Business;
}

export default function BusinessCard({ business }: BusinessCardProps) {
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
    <div className="bg-card rounded-lg shadow-sm overflow-hidden transition-shadow hover:shadow-md">
      <div className="h-40 bg-gradient-to-r from-chart-1/50 to-chart-3/50 relative">
        {/* Business logo or placeholder */}
        <div className="absolute bottom-4 left-4">
          <div className="w-16 h-16 bg-card rounded-lg shadow-lg overflow-hidden border-2 border-background">
          {business.logo && business.logo.startsWith('/') ? (
              <div className="w-full h-full flex items-center justify-center bg-accent text-accent-foreground text-2xl font-bold">
                {business.name.charAt(0)}
              </div>
            ) : (
              <img 
                src={business.logo} 
                alt={`${business.name} logo`} 
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>
        
        {/* Verification badge */}
        <div className="absolute top-4 right-4">
          {getVerificationBadge(business.verificationStatus)}
        </div>
      </div>
      
      <div className="p-4 pt-2">
        <div className="mt-2">
          <h3 className="text-lg font-semibold text-card-foreground">{business.name}</h3>
          <div className="flex items-center mt-1 text-sm text-muted-foreground">
            <Building className="h-4 w-4 mr-1" />
            {business.industry}
          </div>
          <div className="flex items-center mt-1 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            {business.location}
          </div>
        </div>
        
        <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
          {business.description}
        </p>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {business.taglineCategories.slice(0, 2).map((category) => (
            <span key={category.id} className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-xs">
              {category.name}
            </span>
          ))}
          {business.taglineCategories.length > 2 && (
            <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-xs">
              +{business.taglineCategories.length - 2} more
            </span>
          )}
        </div>
        
        <div className="mt-4 pt-4 border-t border-border">
          <Link href={`/business-profile/${business.id}`}>
            <button className="w-full py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition">
              View Profile
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}