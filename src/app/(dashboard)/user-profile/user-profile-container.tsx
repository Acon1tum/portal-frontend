import Link from "next/link";
import { useState } from "react";
import { User, ChevronRight, MapPin, Mail, Phone, MessageSquare } from "lucide-react";
import { User as UserType } from "@/utils/types";
import { useRouter } from "next/navigation";
import { navigateToChatWithUser } from "@/utils/chat-utils";
import Image from "next/image";

export interface UserProfileContainerProps {
  users: UserType[];
  searchQuery: string;
  selectedCategory: string;
}

export default function UserProfileContainer({ 
  users, 
  searchQuery, 
  selectedCategory 
}: UserProfileContainerProps) {
  const router = useRouter();
  const [showAll, setShowAll] = useState(false);

  const handleMessageClick = (user: UserType) => {
    navigateToChatWithUser(user, router);
  };
  
  // Filter users based on search query and selected category
  const filteredUsers = users.filter(user => {
    // Filter by search query (if any)
    const matchesSearch = searchQuery 
      ? user.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.userType?.toLowerCase().includes(searchQuery.toLowerCase()) || false)
      : true;
    
    // Filter by category (if not "all") - using userType as category
    const matchesCategory = selectedCategory === "all" 
      ? true 
      : user.userType === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Show more users to fill the grid
  const initialUsers = 4; // Show 4 users initially
  const displayedUsers = showAll ? filteredUsers : filteredUsers.slice(0, initialUsers);
  const hasMoreUsers = filteredUsers.length > initialUsers;
  
  // If no users match the filters
  if (displayedUsers.length === 0) {
    return (
      <section className="py-8 sm:py-12 bg-background rounded-xl shadow-sm mb-5 dark:bg-card dark:border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">User Profiles</h2>
            <Link href="/user-profiles" className="flex items-center text-primary hover:underline text-sm sm:text-base">
              View all <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          <div className="flex justify-center items-center p-8 sm:p-12 text-muted-foreground text-center">
            <div className="max-w-sm">
              <div className="text-4xl mb-4">👥</div>
              <p className="text-sm sm:text-base">No users match your current filters.</p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2">Try adjusting your search or category selection.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section className="py-8 sm:py-12 bg-background rounded-xl shadow-sm mb-5 dark:bg-card dark:border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">User Profiles</h2>
          <Link href="/user-profiles" className="flex items-center text-primary hover:underline text-sm sm:text-base">
            View all <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {displayedUsers.map((user) => (
              <div key={user.id} className="bg-card rounded-lg shadow-sm overflow-hidden transition-all duration-200 hover:shadow-lg hover:scale-[1.02] dark:border group">
                {/* Header with cover photo or gradient background */}
                <div className="h-32 sm:h-36 lg:h-40 relative overflow-hidden">
                  {user.coverPhoto && user.coverPhoto.startsWith('data:image/') ? (
                    <Image
                      src={user.coverPhoto}
                      alt="Cover photo"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-blue-500/50 to-purple-500/50">
                      {/* Decorative background pattern */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -mr-10 -mt-10"></div>
                        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white rounded-full -ml-8 -mb-8"></div>
                      </div>
                    </div>
                  )}
                  
                  {/* User avatar */}
                  <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-card rounded-lg shadow-lg overflow-hidden border-2 border-background transition-transform group-hover:scale-110">
                      {user.profilePicture && user.profilePicture.startsWith('data:image/') ? (
                        <Image
                          src={user.profilePicture}
                          alt="Profile picture"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-accent text-accent-foreground text-lg sm:text-xl lg:text-2xl font-bold">
                          {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Role badge */}
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                    <div className="bg-white/90 backdrop-blur-sm text-blue-800 text-xs px-2 py-1 rounded-full flex items-center shadow-sm">
                      <User className="w-3 h-3 mr-1" />
                      <span className="hidden sm:inline">{user.role}</span>
                      <span className="sm:hidden">{user.role.split('_')[0]}</span>
                    </div>
                  </div>
                </div>
                
                {/* Content section */}
                <div className="p-3 sm:p-4 pt-2">
                  {/* User info */}
                  <div className="mt-2 space-y-1">
                    <h3 className="text-base sm:text-lg font-semibold text-card-foreground truncate">
                      {user.name || "Anonymous User"}
                    </h3>
                    
                    {user.userType && (
                      <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                        <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                        <span className="truncate">{user.userType}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                      <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                      <span className="truncate">{user.email}</span>
                    </div>
                  </div>
                  
                  {/* Job status */}
                  {user.currentJobStatus && (
                    <div className="mt-2 sm:mt-3">
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Status: <span className="font-medium">{user.currentJobStatus.replace(/_/g, ' ')}</span>
                      </p>
                    </div>
                  )}
                  
                  {/* Badges */}
                  <div className="mt-3 sm:mt-4 flex flex-wrap gap-1 sm:gap-2">
                    <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-xs truncate">
                      {user.role}
                    </span>
                    {user.userType && (
                      <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-xs truncate">
                        {user.userType}
                      </span>
                    )}
                    {user.isEmailVerified && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        Verified
                      </span>
                    )}
                  </div>
                  
                  {/* Action buttons */}
                  <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-border">
                    <div className="flex space-x-2">
                      <Link href={`/user-profile/${user.id}`} className="flex-1">
                        <button className="w-full py-2 px-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
                          <span className="hidden sm:inline">View Profile</span>
                          <span className="sm:hidden">View</span>
                        </button>
                      </Link>
                      <button 
                        onClick={() => handleMessageClick(user)}
                        className="px-3 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors flex items-center justify-center"
                        title="Send Message"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Show More/Less Button */}
          {hasMoreUsers && (
            <div className="flex justify-center">
              <button
                onClick={() => setShowAll(!showAll)}
                className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium"
              >
                {showAll ? 'Show Less' : `Show More (${filteredUsers.length - initialUsers} more)`}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
