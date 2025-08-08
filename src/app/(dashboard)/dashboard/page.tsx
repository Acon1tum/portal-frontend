"use client";

import { useState } from "react";

import { 
  Search, 
  Briefcase, 
  Filter,
  RefreshCw
} from "lucide-react";

// Import Shadcn components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Import FeaturedBusinesses component
import FeaturedBusinesses from "@/app/(dashboard)/featured-businesses/feature-business";

// Import UserProfileContainer component
import UserProfileContainer from "@/app/(dashboard)/user-profile/user-profile-container";

// Import custom hook for data fetching
import { useAuth } from "@/lib/auth-context";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useUsersData } from "@/hooks/useUsersData";

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { businesses, categories, activities, loading: dataLoading, error, refetch } = useDashboardData();
  const { users, loading: usersLoading, error: usersError, refetch: refetchUsers } = useUsersData();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  if (authLoading || dataLoading || usersLoading) {
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

        {/* Two-column layout for Categories and Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Business Categories */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Business Categories</CardTitle>
                  <Button variant="ghost" size="sm" className="text-gray-500">
                    <Filter size={16} className="mr-1" />
                    Filter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex items-center p-4 rounded-lg border ${
                        selectedCategory === category.id 
                          ? 'border-blue-400 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-300'
                      } transition-colors text-left`}
                    >
                      <span className="h-10 w-10 flex items-center justify-center bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg mr-3">
                        <Briefcase size={20} />
                      </span>
                      <div>
                        <h3 className="font-medium">{category.name}</h3>
                        <p className="text-sm text-gray-500">
                          {businesses.filter(b => 
                            b.taglineCategories.some(tc => tc.id === category.id)
                          ).length} businesses
                        </p>
                      </div>
                    </button>
                  ))}
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