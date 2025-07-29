'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Building2, ChevronRight, ChevronLeft, MapPin, Star, FileText, Users, CheckCircle, CheckCircle2 } from 'lucide-react';

import BusinessInfoForm from './business-info-form';
import LocationContactForm from './location-contact-form';
import KeyStrengthsForm from './key-strengths-form';
import ServicesManager from './services-manager';
import TeamManager from './team-manager';

// Define types for the business data structure
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

type KeyStrength = {
  id: string;
  title: string;
  description: string;
};

type Service = {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  imageUrl?: string;
};

type TeamMember = {
  id: string;
  name: string;
  title: string;
  bio: string;
  imageUrl?: string;
  linkedin?: string;
  twitter?: string;
};

type BusinessData = {
  basicInfo: BusinessInfo;
  locationContact: LocationContactData;
  keyStrengths: KeyStrength[];
  services: Service[];
  team: TeamMember[];
};

// Default values
const defaultBusinessHours: BusinessHours = {
  monday: { open: '9:00 AM', close: '5:00 PM', closed: false },
  tuesday: { open: '9:00 AM', close: '5:00 PM', closed: false },
  wednesday: { open: '9:00 AM', close: '5:00 PM', closed: false },
  thursday: { open: '9:00 AM', close: '5:00 PM', closed: false },
  friday: { open: '9:00 AM', close: '5:00 PM', closed: false },
  saturday: { open: '10:00 AM', close: '2:00 PM', closed: false },
  sunday: { open: '10:00 AM', close: '1:00 PM', closed: true }
};

export default function ProfileWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(20);
  const totalSteps = 5;
  
  // Main business data state
  const [businessData, setBusinessData] = useState<BusinessData>({
    // Basic Info
    basicInfo: {
      company: '',
      industry: '',
      companySize: '',
      founded: '',
      description: '',
      tagline: '',
      taxId: '',
    },
    
    // Location & Contact
    locationContact: {
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      phone: '',
      email: '',
      website: '',
      businessHours: defaultBusinessHours,
      socialMedia: {
        linkedin: '',
        twitter: '',
        facebook: '',
        instagram: '',
      }
    },
    
    // Key Strengths
    keyStrengths: [
      { id: '1', title: '', description: '' },
      { id: '2', title: '', description: '' },
      { id: '3', title: '', description: '' }
    ],
    
    // Services
    services: [
      { id: '1', name: '', description: '', price: '', category: 'Services' }
    ],
    
    // Team
    team: [
      { id: '1', name: '', title: '', bio: '' }
    ],
  });

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      setProgress(((currentStep + 1) / totalSteps) * 100);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setProgress(((currentStep - 1) / totalSteps) * 100);
    }
  };

  const handleSubmit = () => {
    // In a real app, you would save all the data to your backend here
    console.log('Saving business profile:', businessData);
    
    // Navigate to the profile view page
    router.push('/owner/profile');
  };

  // Update handlers for different sections
  const updateBasicInfo = (data: BusinessInfo) => {
    setBusinessData(prev => ({
      ...prev,
      basicInfo: data
    }));
  };

  const updateLocationContact = (data: LocationContactData) => {
    setBusinessData(prev => ({
      ...prev,
      locationContact: data
    }));
  };

  const updateKeyStrengths = (data: KeyStrength[]) => {
    setBusinessData(prev => ({
      ...prev,
      keyStrengths: data
    }));
  };

  const updateServices = (data: Service[]) => {
    setBusinessData(prev => ({
      ...prev,
      services: data
    }));
  };

  const updateTeam = (data: TeamMember[]) => {
    setBusinessData(prev => ({
      ...prev,
      team: data
    }));
  };

  const navItems = [
    { step: 1, title: 'Basic Info', icon: <Building2 className="w-4 h-4" /> },
    { step: 2, title: 'Location & Contact', icon: <MapPin className="w-4 h-4" /> },
    { step: 3, title: 'Key Strengths', icon: <Star className="w-4 h-4" /> },
    { step: 4, title: 'Products & Services', icon: <FileText className="w-4 h-4" /> },
    { step: 5, title: 'Team', icon: <Users className="w-4 h-4" /> }
  ];

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold">Create Your Business Profile</h1>
        <p className="text-muted-foreground">Complete your business profile to showcase your company to potential clients and partners.</p>
        <div className="space-y-2">
          <div className="flex justify-between text-sm mb-1">
            <span>Profile Completion</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Step Navigation Sidebar */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Setup Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <nav className="space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.step}
                  onClick={() => {
                    setCurrentStep(item.step);
                    setProgress((item.step / totalSteps) * 100);
                  }}
                  className={`flex items-center w-full p-3 text-left rounded-lg transition-colors ${
                    currentStep === item.step 
                      ? "bg-primary text-primary-foreground" 
                      : currentStep > item.step 
                        ? "bg-primary/10 text-primary" 
                        : "hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center justify-center w-6 h-6 rounded-full mr-3 bg-background text-foreground">
                    {currentStep > item.step ? <CheckCircle className="w-4 h-4 text-primary" /> : item.icon}
                  </div>
                  <span>{item.title}</span>
                </button>
              ))}
            </nav>
            
            <div className="mt-8 space-y-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Need Help?</h4>
                <p className="text-sm text-muted-foreground">Visit our help center for guidance on creating an effective business profile.</p>
                <Button variant="link" className="p-0 h-auto mt-2 text-sm">Help Center</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Main Content Area */}
        <div className="md:col-span-3 space-y-6">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Basic Company Information</CardTitle>
                <CardDescription>Tell potential clients about your business</CardDescription>
              </CardHeader>
              <CardContent>
                <BusinessInfoForm 
                  initialData={businessData.basicInfo}
                  onUpdate={updateBasicInfo} 
                />
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="button" onClick={handleNext}>
                  Next Step
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}
          
          {/* Step 2: Location & Contact */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Location & Contact Information</CardTitle>
                <CardDescription>Make it easy for clients to find and reach you</CardDescription>
              </CardHeader>
              <CardContent>
                <LocationContactForm
                  initialData={businessData.locationContact}
                  onUpdate={updateLocationContact}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={handlePrevious}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                <Button type="button" onClick={handleNext}>
                  Next Step
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}
          
          {/* Step 3: Key Strengths */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Key Strengths & Highlights</CardTitle>
                <CardDescription>Showcase what makes your business special</CardDescription>
              </CardHeader>
              <CardContent>
                <KeyStrengthsForm
                  initialStrengths={businessData.keyStrengths}
                  onUpdate={updateKeyStrengths}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={handlePrevious}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                <Button type="button" onClick={handleNext}>
                  Next Step
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}
          
          {/* Step 4: Products & Services */}
          {currentStep === 4 && (
            <Card>
              <CardHeader>
                <CardTitle>Products & Services</CardTitle>
                <CardDescription>
                  Showcase what your business offers to clients
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ServicesManager
                  initialServices={businessData.services}
                  onSave={updateServices}
                  standalone={false}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={handlePrevious}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                <Button type="button" onClick={handleNext}>
                  Next Step
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}
          
          {/* Step 5: Team Members */}
          {currentStep === 5 && (
            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>Introduce the people behind your business</CardDescription>
              </CardHeader>
              <CardContent>
                <TeamManager
                  initialMembers={businessData.team}
                  onSave={updateTeam}
                  standalone={false}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={handlePrevious}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700" onClick={handleSubmit}>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Save & Complete Profile
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}