"use client";

import { useState } from "react";

import { 
  Search, 
  Briefcase, 
  Filter,
  RefreshCw,
  Calendar,
  Building,
  User,
  ExternalLink,
  Paperclip,
  Image as ImageIcon,
  ChevronDown
} from "lucide-react";

// Import Shadcn components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Import FeaturedBusinesses component
import FeaturedBusinesses from "@/app/(dashboard)/featured-businesses/feature-business";

// Import UserProfileContainer component
import UserProfileContainer from "@/app/(dashboard)/user-profile/user-profile-container";

// Import custom hook for data fetching
import { useAuth } from "@/lib/auth-context";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useUsersData } from "@/hooks/useUsersData";
import { usePostings } from "@/hooks/usePostings";
import { PostType } from "@/utils/types";
import Link from "next/link";

// Dummy data for News and Updates
const dummyNews = [
  {
    id: "1",
    title: "Maritime Industry Conference 2025",
    content: "Join us for the annual Maritime Industry Conference featuring keynote speakers, networking sessions, and the latest industry insights. This year's theme focuses on sustainable shipping practices and digital transformation in maritime operations.",
    postType: PostType.EVENT,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    isPublished: true,
    organization: { name: "Maritime Solutions Inc." },
    createdBy: { name: "Sarah Johnson", email: "sarah@maritime.com" },
    attachments: [{ id: "1", fileName: "conference-brochure.pdf", fileType: "application/pdf" }]
  },
  {
    id: "2",
    title: "New Job Opportunities in Ship Management",
    content: "We're hiring experienced professionals for various positions in ship management. Positions include Fleet Manager, Operations Coordinator, and Technical Superintendent. Competitive salary and benefits package offered.",
    postType: PostType.JOB_LISTING,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    isPublished: true,
    organization: { name: "Global Shipping Co." },
    createdBy: { name: "Mike Chen", email: "mike@globalshipping.com" },
    attachments: []
  },
  {
    id: "3",
    title: "Platform Maintenance Notice",
    content: "Scheduled maintenance will be performed on Sunday, January 26th, from 2:00 AM to 6:00 AM EST. During this time, some features may be temporarily unavailable. We apologize for any inconvenience.",
    postType: PostType.ANNOUNCEMENT,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    isPublished: true,
    organization: { name: "Marino Portal" },
    createdBy: { name: "System Admin", email: "admin@marinoportal.com" },
    attachments: []
  },
  {
    id: "4",
    title: "Sustainable Shipping Practices Guide",
    content: "Download our comprehensive guide on implementing sustainable shipping practices. Learn about fuel efficiency, emission reduction strategies, and compliance with environmental regulations.",
    postType: PostType.NEWS,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    isPublished: true,
    organization: { name: "Green Maritime Initiative" },
    createdBy: { name: "Dr. Emily Rodriguez", email: "emily@greenmaritime.org" },
    attachments: [
      { id: "2", fileName: "sustainable-guide.pdf", fileType: "application/pdf" },
      { id: "3", fileName: "infographic.png", fileType: "image/png" }
    ]
  },
  {
    id: "5",
    title: "Special Discount on Premium Services",
    content: "Get 20% off on all premium services this month! Upgrade your account to access advanced features, priority support, and exclusive networking opportunities. Limited time offer.",
    postType: PostType.PROMOTION,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    isPublished: true,
    organization: { name: "Marino Portal" },
    createdBy: { name: "Marketing Team", email: "marketing@marinoportal.com" },
    attachments: []
  },
  {
    id: "6",
    title: "Industry Trends Report Q4 2024",
    content: "Our quarterly industry trends report is now available. Discover key insights on market dynamics, technological advancements, and emerging opportunities in the maritime sector.",
    postType: PostType.GENERAL,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    isPublished: true,
    organization: { name: "Maritime Analytics" },
    createdBy: { name: "David Thompson", email: "david@maritimeanalytics.com" },
    attachments: [{ id: "4", fileName: "q4-report-2024.pdf", fileType: "application/pdf" }]
  }
];

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { businesses, categories, activities, loading: dataLoading, error, refetch } = useDashboardData();
  const { users, loading: usersLoading, error: usersError, refetch: refetchUsers } = useUsersData();
  const { postings, loading: postingsLoading } = usePostings();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [newsFilter, setNewsFilter] = useState<"ALL" | PostType>("ALL");

  if (authLoading || dataLoading || usersLoading || postingsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || usersError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">{error || usersError}</p>
          <Button onClick={error ? refetch : refetchUsers} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Get recent news and updates (published posts) or use dummy data if no posts
  const recentNews = postings.length > 0 
    ? postings
        .filter(posting => posting.isPublished)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 6)
    : dummyNews;

  const getPostTypeColor = (type: PostType) => {
    switch (type) {
      case PostType.JOB_LISTING: return "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300";
      case PostType.ANNOUNCEMENT: return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300";
      case PostType.NEWS: return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300";
      case PostType.EVENT: return "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300";
      case PostType.PROMOTION: return "bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300";
      case PostType.GENERAL: return "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Helper function to check if file is an image
  const isImageFile = (fileType: string) => {
    return fileType.startsWith('image/');
  };

  // Function to get post type display name
  const getPostTypeDisplayName = (type: PostType) => {
    return type.replace('_', ' ');
  };

  // Apply filter to recent news list
  const displayedNews = newsFilter === "ALL" ? recentNews : recentNews.filter(p => p.postType === newsFilter);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Content */}
      <main className="flex-grow container mx-auto">
        {/* Welcome Banner */}
        <Card className="mb-5 bg-[url('/bgko.jpg')] bg-cover bg-center bg-no-repeat dark:filter dark:brightness-80 text-white shadow-lg rounded-xl">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="mb-4 md:mb-0">
                <h1 className="text-3xl font-bold">Welcome back, {user?.name || "User"}!</h1>
                <p className="text-blue-100 mt-1">Discover ideal business partners effortlessly on our platform</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  onClick={refetch} 
                  variant="ghost" 
                  size="sm"
                  className="text-white hover:bg-white/20"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
          
        {/* Search Section */}
        <Card className="mb-5">
          <CardHeader>
            <CardTitle>Find Businesses</CardTitle>
            <CardDescription>Search for businesses by name, industry, or description</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  className="pl-9"
                  placeholder="Search businesses, services, or products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="md:w-64">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem 
                        key={category.id} 
                        value={category.id}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Featured Businesses Section */}
        <FeaturedBusinesses 
          businesses={businesses}
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
        />

        {/* User Profiles Section */}
        <UserProfileContainer 
          users={users}
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
        />

        {/* Two-column layout for News & Updates and Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* News and Updates */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>News and Updates</CardTitle>
                  <div className="flex items-center gap-2">
                    <Link href="/post-management" className="hidden sm:block">
                      <Button variant="ghost" size="sm" className="text-gray-500">
                        View All
                      </Button>
                    </Link>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-gray-500">
                    <Filter size={16} className="mr-1" />
                          {newsFilter === "ALL" ? "All Posts" : getPostTypeDisplayName(newsFilter)}
                          <ChevronDown size={14} className="ml-1" />
                  </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuItem onClick={() => setNewsFilter("ALL")}>All Posts</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setNewsFilter(PostType.JOB_LISTING)}>Job Listings</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setNewsFilter(PostType.ANNOUNCEMENT)}>Announcements</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setNewsFilter(PostType.NEWS)}>News</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setNewsFilter(PostType.EVENT)}>Events</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setNewsFilter(PostType.PROMOTION)}>Promotions</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setNewsFilter(PostType.GENERAL)}>General</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {displayedNews.length > 0 ? (
                    displayedNews.map(posting => (
                      <Card key={posting.id} className="border border-border/50 shadow-sm hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-base line-clamp-2 font-semibold">{posting.title}</CardTitle>
                            <Badge className={getPostTypeColor(posting.postType)}>
                              {getPostTypeDisplayName(posting.postType)}
                            </Badge>
                          </div>
                          <CardDescription className="text-xs">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              {formatDate(posting.createdAt)}
                            </div>
                          </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="pt-0">
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
                            {posting.content}
                          </p>

                          {/* Attachments Preview */}
                          {posting.attachments && posting.attachments.length > 0 && (
                            <div className="mb-3">
                              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                                <Paperclip className="w-3 h-3" />
                                <span>{posting.attachments.length} attachment{posting.attachments.length !== 1 ? 's' : ''}</span>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                            {posting.organization && (
                              <div className="flex items-center gap-1">
                                <Building className="w-3 h-3" />
                                <span className="truncate">{posting.organization.name}</span>
                              </div>
                            )}
                            {posting.createdBy && (
                              <div className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                <span className="truncate">{posting.createdBy.name || posting.createdBy.email}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex justify-between items-center pt-2 border-t border-border/50">
                            <Link href={`/posts/view/${posting.id}`}>
                              <Button variant="outline" size="sm" className="text-xs rounded-lg hover:bg-muted/50">
                                <ExternalLink className="w-3 h-3 mr-1" />
                                Read More
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-8 text-gray-500">
                      <Briefcase size={24} className="mx-auto mb-2 opacity-50" />
                      <p>No items for this filter</p>
                      </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.length > 0 ? (
                    activities.map(activity => (
                      <div key={activity.id} className="flex items-start p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg">
                        <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-full mr-3">
                          <Briefcase size={16} className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">{activity.business}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{activity.action}</p>
                          <span className="text-xs text-gray-400 dark:text-gray-500">{activity.time}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Briefcase size={24} className="mx-auto mb-2 opacity-50" />
                      <p>No recent activities</p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  View All Activities
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>© 2025 B2B Connect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;