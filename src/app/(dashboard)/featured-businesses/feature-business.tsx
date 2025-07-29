// In your FeaturedBusinesses.tsx file:
import Link from "next/link";
import { Building, ChevronRight, MapPin } from "lucide-react";
import { FeaturedBusinessesProps } from "@/utils/types";

export default function FeaturedBusinesses({ 
  businesses, 
  searchQuery, 
  selectedCategory 
}: FeaturedBusinessesProps) {
  
  // Filter businesses based on search query and selected category
  const filteredBusinesses = businesses.filter(business => {
    // Filter by search query (if any)
    const matchesSearch = searchQuery 
      ? business.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (business.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
        (business.industry?.toLowerCase().includes(searchQuery.toLowerCase()) || false)
      : true;
    
    // Filter by category (if not "all")
    const matchesCategory = selectedCategory === "all" 
      ? true 
      : business.taglineCategories.some(category => category.id === selectedCategory);
    
    return matchesSearch && matchesCategory;
  });
  
  // Show up to 3 businesses
  const displayedBusinesses = filteredBusinesses.slice(0, 3);
  
  // If no businesses match the filters
  if (displayedBusinesses.length === 0) {
    return (
      <section className="py-12 bg-background rounded-xl shadow-sm mb-5 dark:bg-card dark:border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-foreground">Featured Businesses</h2>
            <Link href="/businesses" className="flex items-center text-primary hover:underline">
              View all <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          <div className="flex justify-center items-center p-12 text-muted-foreground">
            No businesses match your current filters.
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section className="py-12 bg-background rounded-xl shadow-sm mb-5 dark:bg-card dark:border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-foreground">Featured Businesses</h2>
          <Link href="/businesses" className="flex items-center text-primary hover:underline">
            View all <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedBusinesses.map((business) => (
            <div key={business.id} className="bg-card rounded-lg shadow-sm overflow-hidden transition-shadow hover:shadow-md dark:border">
              <div className="h-40 bg-gradient-to-r from-chart-1/50 to-chart-3/50 relative">
                {/* Business logo or placeholder */}
                <div className="absolute bottom-4 left-4">
                  <div className="w-16 h-16 bg-card rounded-lg shadow-lg overflow-hidden border-2 border-background">
                    {business.logo && business.logo.startsWith('/') ? (
                      <div className="w-full h-full flex items-center justify-center bg-accent text-accent-foreground text-2xl font-bold">
                        {business.name.charAt(0)}
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-accent text-accent-foreground text-2xl font-bold">
                        {business.name.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Verification badge */}
                {business.verificationStatus === "VERIFIED" && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Verified
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-4 pt-2">
                <div className="mt-2">
                  <h3 className="text-lg font-semibold text-card-foreground">{business.name}</h3>
                  {business.industry && (
                    <div className="flex items-center mt-1 text-sm text-muted-foreground">
                      <Building className="h-4 w-4 mr-1" />
                      {business.industry}
                    </div>
                  )}
                  {business.location && (
                    <div className="flex items-center mt-1 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      {business.location}
                    </div>
                  )}
                </div>
                
                {business.description && (
                  <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                    {business.description}
                  </p>
                )}
                
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
          ))}
        </div>
      </div>
    </section>
  );
}