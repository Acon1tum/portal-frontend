'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, Building2 } from 'lucide-react';
import { ProfileImageEditor } from '@/components/custom-ui/profile/ProfileImageEditor';
import { useAuth } from '@/lib/auth-context';

type BusinessInfo = {
  company: string;
  industry: string;
  companySize: string;
  founded: string;
  description: string;
  tagline: string;
  taxId: string;
  logoUrl?: string;
};

interface BusinessInfoFormProps {
  initialData?: Partial<BusinessInfo>;
  onUpdate?: (data: BusinessInfo) => void;
}

export default function BusinessInfoForm({ 
  initialData = {}, 
  onUpdate 
}: BusinessInfoFormProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState<BusinessInfo>({
    company: initialData.company || '',
    industry: initialData.industry || '',
    companySize: initialData.companySize || '',
    founded: initialData.founded || '',
    description: initialData.description || '',
    tagline: initialData.tagline || '',
    taxId: initialData.taxId || '',
    logoUrl: initialData.logoUrl || ''
  });

  const [profilePicture, setProfilePicture] = useState<string | undefined>(user?.profilePicture);
  const [coverPhoto, setCoverPhoto] = useState<string | undefined>(user?.coverPhoto);

  // Update local state when user data changes
  useEffect(() => {
    if (user) {
      setProfilePicture(user.profilePicture);
      setCoverPhoto(user.coverPhoto);
    }
  }, [user]);

  useEffect(() => {
    if (onUpdate) {
      onUpdate(formData);
    }
  }, [formData, onUpdate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpdate = (type: 'profile' | 'cover', url: string) => {
    if (type === 'profile') {
      setProfilePicture(url);
    } else {
      setCoverPhoto(url);
    }
  };

  // Mock file upload - in a real app, this would upload to cloud storage
  const handleLogoUpload = () => {
    // This is just a placeholder - real implementation would handle file selection and upload
    const mockLogoUrl = '/placeholder-company-logo.jpg';
    setFormData(prev => ({ ...prev, logoUrl: mockLogoUrl }));
  };

  const industryOptions = [
    'Technology', 'Manufacturing', 'Finance', 'Healthcare', 
    'Retail', 'Education', 'Logistics', 'Energy', 'Hospitality',
    'Construction', 'Food & Beverage', 'Marketing', 'Media',
    'Real Estate', 'Telecommunications', 'Transportation', 'Other'
  ];

  const companySizeOptions = [
    '1-10', '11-50', '50-100', '101-250', '251-500', '501-1000', '1000+'
  ];

  return (
    <div className="space-y-6">
      {/* Profile Image Editor */}
      <div className="mb-6">
        <ProfileImageEditor
          profilePicture={profilePicture}
          coverPhoto={coverPhoto}
          onUpdate={handleImageUpdate}
          isOrganization={false}
        />
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3 flex flex-col items-center space-y-4">
          <Avatar className="h-32 w-32">
            <AvatarImage src={formData.logoUrl || ""} alt="Company Logo" />
            <AvatarFallback>
              <Building2 className="h-16 w-16 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          <Button variant="outline" className="w-full" onClick={handleLogoUpload}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Company Logo
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Upload a square logo of at least 400x400 pixels
          </p>
        </div>
        
        <div className="md:w-2/3 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company">Company Name*</Label>
            <Input 
              id="company" 
              name="company" 
              value={formData.company} 
              onChange={handleChange}
              placeholder="e.g., Acme Corporation"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tagline">Tagline</Label>
            <Input 
              id="tagline" 
              name="tagline" 
              value={formData.tagline} 
              onChange={handleChange}
              placeholder="e.g., Innovative Solutions for Modern Businesses"
            />
            <p className="text-xs text-muted-foreground">
              A short, memorable phrase that captures what your business does
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="industry">Industry*</Label>
          <Select 
            value={formData.industry} 
            onValueChange={(value) => handleSelectChange('industry', value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an industry" />
            </SelectTrigger>
            <SelectContent>
              {industryOptions.map(option => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="companySize">Company Size</Label>
          <Select 
            value={formData.companySize} 
            onValueChange={(value) => handleSelectChange('companySize', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              {companySizeOptions.map(option => (
                <SelectItem key={option} value={option}>{option} employees</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="founded">Year Founded</Label>
          <Input 
            id="founded" 
            name="founded" 
            value={formData.founded} 
            onChange={handleChange}
            placeholder="e.g., 2020"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Company Description*</Label>
        <Textarea 
          id="description" 
          name="description" 
          rows={5} 
          value={formData.description} 
          onChange={handleChange}
          placeholder="Describe what your company does, your mission, and what sets you apart from competitors..."
          required
        />
        <p className="text-xs text-muted-foreground">
          Write a compelling description of your business (200-500 words recommended)
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="taxId">Tax ID / Business Registration Number</Label>
        <Input 
          id="taxId" 
          name="taxId" 
          value={formData.taxId} 
          onChange={handleChange}
          placeholder="e.g., XX-XXXXXXX"
        />
        <p className="text-xs text-muted-foreground">
          This information will not be displayed publicly
        </p>
      </div>
    </div>
  );
}