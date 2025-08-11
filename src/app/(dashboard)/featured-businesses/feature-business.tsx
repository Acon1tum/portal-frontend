// In your FeaturedBusinesses.tsx file:
import Link from "next/link";
import { Building, ChevronRight, MapPin, Bookmark } from "lucide-react";
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
          <div
            key={business.id}
            className="relative rounded-2xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-[1.02]"
          >
            {/* Background image - portrait fit */}
            <div
              className="h-[420px] bg-center bg-no-repeat bg-cover transform transition-transform duration-500 group-hover:scale-105"
              style={{
                backgroundImage: `url('/supply.jpg')`,
              }}
            >
                             {/* Top-right verified badge */}
               {business.verificationStatus === "VERIFIED" && (
                 <div className="absolute top-4 right-4 bg-green-500/90 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full flex items-center border border-green-400/50 shadow-lg">
                   <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                   </svg>
                   Verified
                 </div>
               )}

              {/* Premium badge */}
              <div className="absolute top-4 left-4 flex items-center gap-1.5 px-4 py-1.5 
                rounded-full text-xs font-bold tracking-wide uppercase
                bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600
                text-white shadow-lg border border-yellow-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3.5 h-3.5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 
                          18.54 5.82 22 7 14.14l-5-4.87 
                          6.91-1.01L12 2z" />
                </svg>
                Premium
              </div>

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            </div>

            {/* Text content with blurred fade */}
            <div className="absolute bottom-0 left-0 right-0">
              <div className="relative">
                {/* Blurry gradient background */}
                <div className="absolute inset-0 backdrop-blur-xs bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                {/* Text content */}
                <div className="relative p-5 text-white">
                  <h3 className="text-xl font-bold mb-1">{business.name}</h3>
                  <p className="text-sm opacity-90 mb-3 line-clamp-2">
                    {business.description ||
                      'Experience a unique stay or service with premium quality.'}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-white/20 px-3 py-1 rounded-full text-xs flex items-center">
                      ★ 4.8
                    </span>
                    <span className="bg-white/20 px-3 py-1 rounded-full text-xs">
                      {business.industry || 'Category'}
                    </span>
                    {business.taglineCategories?.length > 0 && (
                      <span className="bg-white/20 px-3 py-1 rounded-full text-xs">
                        {business.taglineCategories[0].name}
                      </span>
                    )}
                  </div>

                  {/* CTA button */}
                  <Link href={`/business-profile/${business.id}`}>
                    <button className="w-full py-3 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-200 transition">
                      View Profile
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
        </div>
      </div>
    </section>
  );
}