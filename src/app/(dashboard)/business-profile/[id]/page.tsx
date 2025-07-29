"use client";

import { useParams, useRouter } from "next/navigation";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import BusinessProfileHeader from "../business-pages/business-profile";
import BusinessTabs from "../business-pages/business-tabs";
import OverviewTab from "../business-pages/overview-tab";
import ProductsTab from "../business-pages/product-tabs";
import TeamTab from "../business-pages/team-tabs";
import ReviewsTab from "../business-pages/review-tabs";
import { useBusinessProfile } from "@/hooks/useBusinessProfile";
import { useState } from "react";

export default function BusinessProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { business, loading, error, refetch } = useBusinessProfile(id);
  const [activeTab, setActiveTab] = useState("overview");

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-lg">Loading business profile...</p>
        </div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <AlertCircle className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold text-foreground mb-2">Business Not Found</h1>
        <p className="text-muted-foreground mb-6 text-center">
          {error || "The business you're looking for doesn't exist or has been removed."}
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
      <BusinessProfileHeader business={business} />
      <BusinessTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === "overview" && <OverviewTab business={business} onViewProducts={() => setActiveTab("products")} />}
        {activeTab === "products" && <ProductsTab business={business} />}
        {activeTab === "team" && <TeamTab business={business} />}
        {activeTab === "reviews" && <ReviewsTab business={business} />}
      </div>
    </div>
  );
}