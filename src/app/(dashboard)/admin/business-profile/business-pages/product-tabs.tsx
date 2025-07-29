import { Business } from "@/utils/types";
import { ShoppingBag } from "lucide-react";
import { getProductsForBusiness, getProductCategories } from "./business-data";
import { useState } from "react";

interface ProductsTabProps {
  business: Business;
}

export default function ProductsTab({ business }: ProductsTabProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const products = getProductsForBusiness(business.industry || '');
  const categories = getProductCategories(business.industry || '');
  
  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter(product => product.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-6 text-foreground">Products & Services</h2>
        <p className="text-muted-foreground mb-8 max-w-3xl">
          Explore the complete range of products and services offered by {business.name}. 
          Contact them directly for custom solutions and pricing information.
        </p>
        
        {/* Categories filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button 
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-full text-sm transition ${
              selectedCategory === "all" 
                ? "bg-primary text-primary-foreground" 
                : "bg-secondary text-secondary-foreground hover:bg-primary/10"
            }`}
          >
            All
          </button>
          {categories.map((category, index) => (
            <button 
              key={index} 
              onClick={() => setSelectedCategory(category.toLowerCase())}
              className={`px-4 py-2 rounded-full text-sm transition ${
                selectedCategory === category.toLowerCase() 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-secondary text-secondary-foreground hover:bg-primary/10"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <div key={index} className="border border-border rounded-lg overflow-hidden hover:shadow-md transition group cursor-pointer">
              <div className="h-48 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-card-foreground">{product.name}</h3>
                  {product.price && (
                    <span className="px-2 py-1 bg-accent text-accent-foreground rounded text-sm">
                      {product.price}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-3">{product.description}</p>
                <div className="flex items-center text-xs text-muted-foreground">
                  <ShoppingBag className="h-3 w-3 mr-1" />
                  {product.category}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}