'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Image, Plus, Trash2, Save } from 'lucide-react';

type Service = {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  imageUrl?: string;
};

interface ServicesManagerProps {
  initialServices?: Service[];
  onSave?: (services: Service[]) => void;
  standalone?: boolean;
}

export default function ServicesManager({ 
  initialServices = [], 
  onSave,
  standalone = false 
}: ServicesManagerProps) {
  const [services, setServices] = useState<Service[]>(
    initialServices.length > 0 
      ? initialServices 
      : [{ id: crypto.randomUUID(), name: '', description: '', price: '', category: 'Services' }]
  );
  
  const categories = ['Services', 'Products', 'Software', 'Consulting', 'Training', 'Support'];

  const handleServiceChange = (id: string, field: keyof Service, value: string) => {
    setServices(prev => 
      prev.map(service => 
        service.id === id ? { ...service, [field]: value } : service
      )
    );
  };

  const addService = () => {
    setServices(prev => [
      ...prev, 
      { 
        id: crypto.randomUUID(), 
        name: '', 
        description: '', 
        price: '', 
        category: 'Services' 
      }
    ]);
  };

  const removeService = (id: string) => {
    setServices(prev => prev.filter(service => service.id !== id));
  };

  const handleSave = () => {
    if (onSave) {
      onSave(services);
    }
  };

  return (
    <div className="space-y-6">
      {standalone && (
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Products & Services</h1>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className={standalone ? "text-xl font-semibold" : "text-2xl font-bold"}>
            {standalone ? "Manage Products & Services" : "Products & Services"}
          </h2>
          
          {standalone && (
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">All</Button>
              <Button variant="ghost" size="sm">Services</Button>
              <Button variant="ghost" size="sm">Products</Button>
              <Button variant="ghost" size="sm">Software</Button>
            </div>
          )}
        </div>
        
        <p className="text-sm text-muted-foreground">
          Add your main products or services that clients can purchase from your business. You can add pricing information if applicable.
        </p>
        
        {services.map((service) => (
          <Card key={service.id} className="p-0 overflow-hidden">
            <CardHeader className="bg-muted/50 p-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">
                  {service.name || `New Service/Product`}
                </h4>
                {services.length > 1 && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    onClick={() => removeService(service.id)}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor={`service-name-${service.id}`}>Name</Label>
                  <Input 
                    id={`service-name-${service.id}`}
                    value={service.name}
                    onChange={(e) => handleServiceChange(service.id, 'name', e.target.value)}
                    placeholder="e.g., Cloud Migration Services"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`service-price-${service.id}`}>Price</Label>
                  <Input 
                    id={`service-price-${service.id}`}
                    value={service.price}
                    onChange={(e) => handleServiceChange(service.id, 'price', e.target.value)}
                    placeholder="e.g., $99/mo, Custom"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`service-category-${service.id}`}>Category</Label>
                  <Select 
                    value={service.category} 
                    onValueChange={(value) => handleServiceChange(service.id, 'category', value)}
                  >
                    <SelectTrigger id={`service-category-${service.id}`}>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`service-description-${service.id}`}>Description</Label>
                <Textarea 
                  id={`service-description-${service.id}`}
                  rows={3}
                  value={service.description}
                  onChange={(e) => handleServiceChange(service.id, 'description', e.target.value)}
                  placeholder="Describe this product or service in 1-3 sentences..."
                />
              </div>
              
              <div>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  className="mt-2"
                >
                  <Image className="mr-2 h-4 w-4" />
                  Upload Image
                </Button>
                
                {service.imageUrl && (
                  <div className="mt-2 relative w-full aspect-video bg-slate-100 rounded-md overflow-hidden">
                    <img src={service.imageUrl} alt={service.name} className="object-cover w-full h-full" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        
        <Button 
          type="button" 
          variant="outline" 
          className="w-full mt-4"
          onClick={addService}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Another Product/Service
        </Button>
      </div>
      
      {!standalone && (
        <div className="flex justify-end mt-6">
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
}