"use client";

import { useParams, useRouter } from "next/navigation";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import UserProfileHeader from "../user-pages/user-profile-header";
import UserTabs from "../user-pages/user-tabs";
import OverviewTab from "../user-pages/overview-tab";
import PostsTab from "../user-pages/posts-tab";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useState } from "react";

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { user, loading, error, refetch } = useUserProfile(id);
  const [activeTab, setActiveTab] = useState("overview");

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-lg">Loading user profile...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <AlertCircle className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold text-foreground mb-2">User Not Found</h1>
        <p className="text-muted-foreground mb-6 text-center">
          {error || "The user you're looking for doesn't exist or has been removed."}
        </p>
        <div className="flex space-x-4">
          <Button 
            onClick={() => refetch()}
            variant="outline"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
          <Button 
            onClick={() => router.push("/dashboard")}
          >
            Go Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <UserProfileHeader user={user} />
      <UserTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === "overview" && <OverviewTab user={user} />}
        {activeTab === "posts" && <PostsTab user={user} />}
        {/* Add other tabs as needed */}
        {activeTab === "experience" && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Experience tab coming soon...</p>
          </div>
        )}
        {activeTab === "documents" && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Documents tab coming soon...</p>
          </div>
        )}
        {activeTab === "reviews" && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Reviews tab coming soon...</p>
          </div>
        )}
        {activeTab === "settings" && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Settings tab coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
}