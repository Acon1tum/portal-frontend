import { getAllBusinesses } from "@/utils/dummy-data";
import BusinessCard from "./business-card";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function FeaturedBusinesses() {
  const businesses = getAllBusinesses();
  
  return (
    <section className="py-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-foreground">Featured Businesses</h2>
          <Link href="/businesses" className="flex items-center text-primary hover:underline">
            View all <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.slice(0, 3).map((business) => (
            <BusinessCard key={business.id} business={business} />
          ))}
        </div>
      </div>
    </section>
  );
}