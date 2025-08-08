'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Phone, Mail, Globe, Link as LinkIcon } from 'lucide-react';
import { ProfileImageEditor } from '@/components/custom-ui/profile/ProfileImageEditor';
import { useAuth } from '@/lib/auth-context';

type BusinessHours = {
  monday: { open: string; close: string; closed: boolean };
  tuesday: { open: string; close: string; closed: boolean };
  wednesday: { open: string; close: string; closed: boolean };
  thursday: { open: string; close: string; closed: boolean };
  friday: { open: string; close: string; closed: boolean };
  saturday: { open: string; close: string; closed: boolean };
  sunday: { open: string; close: string; closed: boolean };
};

type SocialMedia = {
  linkedin: string;
  twitter: string;
  facebook: string;
  instagram: string;
};

type LocationContactData = {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  businessHours: BusinessHours;
  socialMedia: SocialMedia;
};

interface LocationContactFormProps {
  initialData?: Partial<LocationContactData>;
  onUpdate?: (data: LocationContactData) => void;
}

const defaultBusinessHours: BusinessHours = {
  monday: { open: '9:00 AM', close: '5:00 PM', closed: false },
  tuesday: { open: '9:00 AM', close: '5:00 PM', closed: false },
  wednesday: { open: '9:00 AM', close: '5:00 PM', closed: false },
  thursday: { open: '9:00 AM', close: '5:00 PM', closed: false },
  friday: { open: '9:00 AM', close: '5:00 PM', closed: false },
  saturday: { open: '10:00 AM', close: '2:00 PM', closed: false },
  sunday: { open: '10:00 AM', close: '1:00 PM', closed: true }
};

const defaultSocialMedia: SocialMedia = {
  linkedin: '',
  twitter: '',
  facebook: '',
  instagram: ''
};

export default function LocationContactForm({ 
  initialData = {}, 
  onUpdate 
}: LocationContactFormProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState<LocationContactData>({
    address: initialData.address || '',
    city: initialData.city || '',
    state: initialData.state || '',
    zipCode: initialData.zipCode || '',
    country: initialData.country || '',
    phone: initialData.phone || '',
    email: initialData.email || '',
    website: initialData.website || '',
    businessHours: initialData.businessHours 
      ? {
          monday: { ...defaultBusinessHours.monday, ...initialData.businessHours.monday },
          tuesday: { ...defaultBusinessHours.tuesday, ...initialData.businessHours.tuesday },
          wednesday: { ...defaultBusinessHours.wednesday, ...initialData.businessHours.wednesday },
          thursday: { ...defaultBusinessHours.thursday, ...initialData.businessHours.thursday },
          friday: { ...defaultBusinessHours.friday, ...initialData.businessHours.friday },
          saturday: { ...defaultBusinessHours.saturday, ...initialData.businessHours.saturday },
          sunday: { ...defaultBusinessHours.sunday, ...initialData.businessHours.sunday }
        }
      : defaultBusinessHours,
    socialMedia: initialData.socialMedia 
      ? { ...defaultSocialMedia, ...initialData.socialMedia }
      : defaultSocialMedia
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      if (parent === 'socialMedia') {
        setFormData(prev => ({
          ...prev,
          socialMedia: {
            ...prev.socialMedia,
            [child]: value
          }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleHoursChange = (day: keyof BusinessHours, field: 'open' | 'close', value: string) => {
    setFormData(prev => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: {
          ...prev.businessHours[day],
          [field]: value
        }
      }
    }));
  };

  const toggleClosed = (day: keyof BusinessHours) => {
    setFormData(prev => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: {
          ...prev.businessHours[day],
          closed: !prev.businessHours[day].closed
        }
      }
    }));
  };

  const handleImageUpdate = (type: 'profile' | 'cover', url: string) => {
    if (type === 'profile') {
      setProfilePicture(url);
    } else {
      setCoverPhoto(url);
    }
  };

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Location Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium flex items-center">
            <MapPin className="mr-2 h-5 w-5 text-primary" />
            Business Address
          </h3>
          
          <div className="space-y-2">
            <Label htmlFor="address">Street Address*</Label>
            <Input 
              id="address" 
              name="address" 
              value={formData.address} 
              onChange={handleChange}
              placeholder="e.g., 123 Business Street"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City*</Label>
              <Input 
                id="city" 
                name="city" 
                value={formData.city} 
                onChange={handleChange}
                placeholder="e.g., San Francisco"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State/Province*</Label>
              <Input 
                id="state" 
                name="state" 
                value={formData.state} 
                onChange={handleChange}
                placeholder="e.g., CA"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="zipCode">Zip/Postal Code*</Label>
              <Input 
                id="zipCode" 
                name="zipCode" 
                value={formData.zipCode} 
                onChange={handleChange}
                placeholder="e.g., 94105"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country*</Label>
              <Input 
                id="country" 
                name="country" 
                value={formData.country} 
                onChange={handleChange}
                placeholder="e.g., United States"
                required
              />
            </div>
          </div>
        </div>
        
        {/* Contact Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium flex items-center">
            <Phone className="mr-2 h-5 w-5 text-primary" />
            Contact Details
          </h3>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number*</Label>
            <Input 
              id="phone" 
              name="phone" 
              value={formData.phone} 
              onChange={handleChange}
              placeholder="e.g., +1 (555) 123-4567"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address*</Label>
            <Input 
              id="email" 
              name="email" 
              type="email"
              value={formData.email} 
              onChange={handleChange}
              placeholder="e.g., contact@acmecorp.com"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input 
              id="website" 
              name="website" 
              value={formData.website} 
              onChange={handleChange}
              placeholder="e.g., www.acmecorp.com"
            />
          </div>
          
          <h3 className="text-lg font-medium flex items-center mt-6">
            <Globe className="mr-2 h-5 w-5 text-primary" />
            Social Media
          </h3>
          
          <div className="space-y-2">
            <Label htmlFor="socialMedia.linkedin">LinkedIn</Label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                <LinkIcon className="h-4 w-4" />
              </span>
              <Input
                id="socialMedia.linkedin"
                name="socialMedia.linkedin"
                value={formData.socialMedia.linkedin}
                onChange={handleChange}
                placeholder="e.g., linkedin.com/company/acmecorp"
                className="rounded-l-none"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="socialMedia.twitter">Twitter/X</Label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                  @
                </span>
                <Input
                  id="socialMedia.twitter"
                  name="socialMedia.twitter"
                  value={formData.socialMedia.twitter}
                  onChange={handleChange}
                  placeholder="e.g., acmecorp"
                  className="rounded-l-none"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="socialMedia.facebook">Facebook</Label>
              <Input 
                id="socialMedia.facebook" 
                name="socialMedia.facebook" 
                value={formData.socialMedia.facebook} 
                onChange={handleChange}
                placeholder="e.g., facebook.com/acmecorp"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Business Hours Section */}
      <div className="md:col-span-2 pt-4">
        <h3 className="text-lg font-medium flex items-center mb-4">
          <Clock className="mr-2 h-5 w-5 text-primary" />
          Business Hours
        </h3>
        
        <div className="grid gap-4">
          {Object.entries(formData.businessHours).map(([day, hours]) => (
            <div key={day} className="flex items-center justify-between">
              <div className="w-1/4">
                <Label>{day.charAt(0).toUpperCase() + day.slice(1)}</Label>
              </div>
              {!hours.closed ? (
                <div className="flex items-center space-x-2 w-2/3">
                  <Input 
                    value={hours.open}
                    onChange={(e) => handleHoursChange(day as keyof BusinessHours, 'open', e.target.value)}
                    className="w-24"
                  />
                  <span>to</span>
                  <Input 
                    value={hours.close}
                    onChange={(e) => handleHoursChange(day as keyof BusinessHours, 'close', e.target.value)}
                    className="w-24"
                  />
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    onClick={() => toggleClosed(day as keyof BusinessHours)}
                  >
                    Set as closed
                  </Button>
                </div>
              ) : (
                <div className="flex items-center w-2/3">
                  <Badge variant="outline" className="mr-4">Closed</Badge>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    onClick={() => toggleClosed(day as keyof BusinessHours)}
                  >
                    Set hours
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}