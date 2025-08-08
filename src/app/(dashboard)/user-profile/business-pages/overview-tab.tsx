import { Business } from "@/utils/types";
import { Tag, Calendar, MapPin, Phone, Mail, Globe, Clock, Users, Award, TrendingUp } from "lucide-react";
import { getProductsForBusiness } from "./business-data";
import Image from "next/image";

interface OverviewTabProps {
  business: Business;
  onViewProducts: () => void;
}

export default function OverviewTab({ business, onViewProducts }: OverviewTabProps) {
  const products = getProductsForBusiness(business.industry || "");

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Main content */}
      <div className="md:col-span-2 space-y-6">
        {/* About */}
        <div className="bg-card rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4 text-card-foreground">About</h2>
          <p className="text-muted-foreground mb-4">{business.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="flex items-start">
              <Tag className="h-5 w-5 text-muted-foreground mr-2 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-card-foreground">Industry</h3>
                <p className="text-muted-foreground">{business.industry || "Various Industries"}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Calendar className="h-5 w-5 text-muted-foreground mr-2 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-card-foreground">Founded</h3>
                <p className="text-muted-foreground">
                  {new Date(business.createdAt).getFullYear()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Strengths */}
        <div className="bg-card rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6 text-card-foreground">Key Strengths</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-center p-4 bg-secondary rounded-lg text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium text-card-foreground mb-1">Expertise</h3>
              <p className="text-sm text-muted-foreground">Industry-leading knowledge and professional experience</p>
            </div>
            
            <div className="flex flex-col items-center p-4 bg-secondary rounded-lg text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium text-card-foreground mb-1">Team</h3>
              <p className="text-sm text-muted-foreground">Skilled professionals dedicated to client success</p>
            </div>
            
            <div className="flex flex-col items-center p-4 bg-secondary rounded-lg text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium text-card-foreground mb-1">Innovation</h3>
              <p className="text-sm text-muted-foreground">Cutting-edge solutions and forward-thinking approach</p>
            </div>
          </div>
        </div>

        {/* Products & Services Preview */}
        <div className="bg-card rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-card-foreground">Products & Services</h2>
            <button 
              className="text-primary text-sm font-medium hover:underline"
              onClick={onViewProducts}
            >
              View All
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {products.slice(0, 4).map((product, index) => (
              <div key={index} className="border border-border rounded-lg p-4 hover:border-primary/50 transition cursor-pointer">
                <div className="h-40 bg-secondary rounded-md mb-3 flex items-center justify-center overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-medium text-card-foreground">{product.name}</h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Contact information */}
        <div className="bg-card rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4 text-card-foreground">Contact Information</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-card-foreground">Location</h3>
                <p className="text-muted-foreground">{business.location || "Multiple Locations"}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Phone className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-card-foreground">Phone</h3>
                <p className="text-primary hover:underline cursor-pointer">{business.phoneNumber}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Mail className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-card-foreground">Email</h3>
                <p className="text-primary hover:underline cursor-pointer">{business.email}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Globe className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-card-foreground">Website</h3>
                <a href={business.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  {business.domain}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-card rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4 text-card-foreground">Categories</h2>
          <div className="flex flex-wrap gap-2">
            {business.taglineCategories.map((category) => (
              <span key={category.id} className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm">
                {category.name}
              </span>
            ))}
          </div>
        </div>

        {/* Business hours */}
        <div className="bg-card rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4 text-card-foreground">Business Hours</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">Monday - Friday</span>
              </div>
              <span className="text-card-foreground">9:00 AM - 5:00 PM</span>
            </div>
            <div className="flex justify-between">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">Saturday</span>
              </div>
              <span className="text-card-foreground">10:00 AM - 2:00 PM</span>
            </div>
            <div className="flex justify-between">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">Sunday</span>
              </div>
              <span className="text-card-foreground">Closed</span>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="bg-card rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4 text-card-foreground">Location</h2>
          <div className="rounded-lg overflow-hidden bg-secondary h-48 flex items-center justify-center">
            <MapPin className="h-8 w-8 text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Map view</span>
          </div>
          <button className="w-full mt-4 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-primary/10 transition">
            Get Directions
          </button>
        </div>
      </div>
    </div>
  );
}