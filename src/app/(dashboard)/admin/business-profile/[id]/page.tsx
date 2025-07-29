"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { getBusinessById } from "@/utils/dummy-data";
import { Business } from "@/utils/types";
import BusinessProfileHeader from "../business-pages/business-profile";
import BusinessTabs from "../business-pages/business-tabs";
import OverviewTab from "../business-pages/overview-tab";
import ProductsTab from "../business-pages/product-tabs";
import TeamTab from "../business-pages/team-tabs";
import ReviewsTab from "../business-pages/review-tabs";
import router from "next/router";

export default function BusinessProfilePage() {
  const params = useParams();
  const id = params.id as string;
  const [business, setBusiness] = useState<Business | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("ID parameter:", id);
    if (id) {
      // Fetch business data from dummy data
      const businessData = getBusinessById(id);
      console.log("Business data:", businessData);
      setBusiness(businessData || null);
      setIsLoading(false);
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">
          <div className="h-16 w-16 bg-muted rounded-full"></div>
          <div className="mt-4 text-muted-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <AlertCircle className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold text-foreground mb-2">Business Not Found</h1>
        <p className="text-muted-foreground mb-6">The business you're looking for doesn't exist or has been removed.</p>
        <button 
          onClick={() => router.push("/")}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
        >
          Go Back Home
        </button>
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