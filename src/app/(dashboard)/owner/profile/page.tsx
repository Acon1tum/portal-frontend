'use client';

import { useAuth } from '@/lib/auth-context';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ProfileImageEditor } from '@/components/custom-ui/profile/ProfileImageEditor';
import { fetchUserProfile } from '@/service/authservice';
import { SessionUser } from '@/utils/types';
import { 
  Building2, Mail, Phone, Globe, MapPin, Edit, Shield, 
  FileText, CheckCircle2, Users, Star, ExternalLink, Calendar
} from 'lucide-react';

export default function ProfilePage() {
  const { user: sessionUser, loading: authLoading } = useAuth(); // Fetch user data from the authentication context
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [profilePicture, setProfilePicture] = useState<string | undefined>();
  const [coverPhoto, setCoverPhoto] = useState<string | undefined>();

  // Fetch complete user profile data
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!authLoading && sessionUser) {
        try {
          setLoading(true);
          console.log('ProfilePage: Fetching complete user profile...');
          console.log('ProfilePage: Session user ID:', sessionUser.id);
          console.log('ProfilePage: Session user data:', sessionUser);
          
          const completeUserProfile = await fetchUserProfile();
          
          if (completeUserProfile) {
            console.log('ProfilePage: Complete user profile loaded:', completeUserProfile);
            console.log('ProfilePage: Profile picture:', completeUserProfile.profilePicture ? 'base64_data' : 'none');
            console.log('ProfilePage: Cover photo:', completeUserProfile.coverPhoto ? 'base64_data' : 'none');
            
            setUser(completeUserProfile);
            setProfilePicture(completeUserProfile.profilePicture);
            setCoverPhoto(completeUserProfile.coverPhoto);
          } else {
            console.log('ProfilePage: No complete user profile found, using session user');
            console.log('ProfilePage: Session user profile picture:', sessionUser.profilePicture ? 'base64_data' : 'none');
            console.log('ProfilePage: Session user cover photo:', sessionUser.coverPhoto ? 'base64_data' : 'none');
            setUser(sessionUser);
            setProfilePicture(sessionUser.profilePicture);
            setCoverPhoto(sessionUser.coverPhoto);
          }
        } catch (error) {
          console.error('ProfilePage: Error fetching user profile:', error);
          // Fallback to session user
          setUser(sessionUser);
          setProfilePicture(sessionUser?.profilePicture);
          setCoverPhoto(sessionUser?.coverPhoto);
        } finally {
          setLoading(false);
        }
      } else if (!authLoading && !sessionUser) {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [sessionUser, authLoading]);

  // Add debugging logs
  useEffect(() => {
    console.log('ProfilePage: Auth loading state:', authLoading);
    console.log('ProfilePage: Session user data:', sessionUser);
    console.log('ProfilePage: Complete user data:', user);
  }, [authLoading, sessionUser, user]);

  if (authLoading || loading) {
    console.log('ProfilePage: Still loading...');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    console.log('ProfilePage: No user found, redirecting...');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>No user found. Please log in.</p>
      </div>
    );
  }

  console.log('ProfilePage: Rendering profile page for user:', user.name);

  const handleImageUpdate = (type: 'profile' | 'cover', url: string) => {
    if (type === 'profile') {
      setProfilePicture(url);
    } else {
      setCoverPhoto(url);
    }
  };

  const profile = {
    name: user.name,
    title: 'CEO & Founder',
    company: 'Acme Corporation',
    email: user.email,
    phone: '+1 (555) 123-4567',
    website: 'www.acme.com',
    location: 'San Francisco, CA',
    bio: 'Experienced business leader with over 15 years in the technology sector. Specializing in B2B solutions and enterprise software.',
    profileCompleted: 85,
    lastUpdated: '2025-04-01',
    industry: 'Technology',
    companySize: '50-100 employees',
    founded: '2010',
    connections: 45,
    activeConversations: 12,
    strengths: [
      { title: 'Expertise', description: 'Industry-leading knowledge and experience' },
      { title: 'Innovation', description: 'Cutting-edge solutions and forward thinking' },
      { title: 'Support', description: '24/7 dedicated customer service and support' }
    ],
    services: [
      { name: 'Cloud Migration', description: 'Seamless transition to cloud infrastructure' },
      { name: 'Security Consulting', description: 'Comprehensive security assessment and solutions' }
    ],
    team: [
      { name: 'Jane Smith', title: 'CTO', image: '/placeholder-1.jpg' },
      { name: 'Mike Johnson', title: 'COO', image: '/placeholder-2.jpg' }
    ],
    documents: [
      { name: 'Business License', date: '2025-01-15' },
      { name: 'Tax Registration', date: '2025-02-10' }
    ]
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black">
      {/* Header section with gradient background */}
      <div className="">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Profile</h1>
            <Link href="/owner/profile/edit">
              <Button variant="secondary" size="sm" className="gap-2">
                <Edit className="h-4 w-4" />
                Edit Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left sidebar with profile information */}
          <div className="space-y-6">
            {/* Profile card with image editor */}
            <Card className="overflow-hidden border-none shadow-md dark:bg-gray-800 dark:text-gray-100">
              {/* Image Editor Section */}
              <div className="relative">
                <ProfileImageEditor
                  profilePicture={profilePicture}
                  coverPhoto={coverPhoto}
                  onUpdate={handleImageUpdate}
                />
              </div>
              
              {/* Profile Info Section */}
              <div className="px-6 py-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-semibold">{profile.name}</h2>
                  <p className="text-gray-500 dark:text-gray-400">{profile.title}</p>
                  
                  <Badge className="mt-2 bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Building2 className="h-5 w-5 mr-3 text-gray-400 dark:text-gray-500" />
                    <span>{profile.company}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 mr-3 text-gray-400 dark:text-gray-500" />
                    <span>{profile.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 mr-3 text-gray-400 dark:text-gray-500" />
                    <span>{profile.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <Globe className="h-5 w-5 mr-3 text-gray-400 dark:text-gray-500" />
                    <span>
                      {profile.website}
                      <Button variant="link" size="sm" className="h-auto p-0 ml-1">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-3 text-gray-400 dark:text-gray-500" />
                    <span>{profile.location}</span>
                  </div>
                </div>
                
                <Separator className="my-6 dark:bg-gray-700" />
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Profile Completion</span>
                    <span className="font-medium">{profile.profileCompleted}%</span>
                  </div>
                  <Progress value={profile.profileCompleted} className="h-2 dark:bg-gray-700 dark:progress-bar:bg-blue-600" />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Last updated: {profile.lastUpdated}
                  </p>
                </div>
              </div>
            </Card>
            
            {/* Quick actions card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Connections
                </Button>
                <Button variant="outline" className="justify-start">
                  <Shield className="h-4 w-4 mr-2" />
                  Security
                </Button>
                <Button variant="outline" className="justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Documents
                </Button>
                <Button variant="outline" className="justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Calendar
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Main content area */}
          <div className="md:col-span-2 space-y-6">
            <Tabs defaultValue="about" className="w-full">
              <div className="border-b mb-6">
                <TabsList className="bg-transparent h-auto p-0 w-full justify-start space-x-6">
                  <TabsTrigger 
                    value="about" 
                    className="pb-3 px-1 data-[state=active]:border-b-2 rounded-3xl data-[state=active]:border-blue-600 
                             data-[state=active]:shadow-none  bg-transparent
                             data-[state=active]:text-blue-600 font-medium"
                  >
                    About
                  </TabsTrigger>
                  <TabsTrigger 
                    value="business" 
                    className="pb-3 px-1 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 
                             data-[state=active]:shadow-none rounded-3xl bg-transparent
                             data-[state=active]:text-blue-600 font-medium"
                  >
                    Business Details
                  </TabsTrigger>
                  <TabsTrigger 
                    value="security" 
                    className="pb-3 px-1 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 
                             data-[state=active]:shadow-none rounded-3xl bg-transparent
                             data-[state=active]:text-blue-600 font-medium"
                  >
                    Security
                  </TabsTrigger>
                  <TabsTrigger 
                    value="documents" 
                    className="pb-3 px-1 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 
                             data-[state=active]:shadow-none rounded-3xl bg-transparent
                             data-[state=active]:text-blue-600 font-medium"
                  >
                    Documents
                  </TabsTrigger>
                </TabsList>
              </div>
              
              {/* About Tab */}
              <TabsContent value="about" className="space-y-6 mt-0">
                {/* Bio section */}
                <Card className="border-none shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle>Professional Bio</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{profile.bio}</p>
                  </CardContent>
                </Card>
                
                {/* Network overview */}
                <Card className="border-none shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle>Network Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border  rounded-xl p-6 text-center">
                        <p className="text-4xl font-bold text-blue-600 dark:text-gray-100">{profile.connections}</p>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Connections</p>
                      </div>
                      <div className="border rounded-xl p-6 text-center">
                        <p className="text-4xl font-bold text-blue-600 dark:text-gray-100">{profile.activeConversations}</p>
                        <p className="text-gray-500 mt-1">Active Conversations</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Key strengths */}
                <Card className="border-none shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle>Key Strengths</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {profile.strengths.map((strength, i) => (
                        <div 
                          key={i} 
                          className="border flex flex-col items-center justify-center rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 mb-3">
                            <Star className="h-5 w-5 text-blue-600" />
                          </div>
                          <h3 className="font-semibold mb-1 text-center">{strength.title}</h3>
                          <p className="text-sm text-gray-500 text-center">{strength.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Business Details Tab */}
              <TabsContent value="business" className="space-y-6 mt-0">
                <Card className="border-none shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle>Company Information</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-2 gap-y-6">
                      <div>
                        <p className="text-sm text-gray-500">Company Name</p>
                        <p className="font-medium">{profile.company}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Industry</p>
                        <p className="font-medium">{profile.industry}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Company Size</p>
                        <p className="font-medium">{profile.companySize}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Year Founded</p>
                        <p className="font-medium">{profile.founded}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4 flex justify-end">
                    <Link href="/owner/profile/business-info">
                      <Button variant="outline" size="sm">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Business Information
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
                
                {/* Services */}
                <Card className="border-none shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle>Services</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {profile.services.map((service, i) => (
                        <div key={i} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <h3 className="font-semibold mb-1">{service.name}</h3>
                          <p className="text-sm text-gray-500">{service.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4 flex justify-end">
                    <Link href="/owner/profile/services-manager">
                      <Button variant="outline" size="sm">
                        <Edit className="mr-2 h-4 w-4" />
                        Manage Services
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
                
                {/* Team */}
                <Card className="border-none shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle>Team</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {profile.team.map((member, i) => (
                        <div key={i} className="flex items-center border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <Avatar className="h-12 w-12 mr-4">
                            <AvatarImage src={member.image} />
                            <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{member.name}</p>
                            <p className="text-sm text-gray-500">{member.title}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4 flex justify-end">
                    <Link href="/owner/profile/team-manager">
                      <Button variant="outline" size="sm">
                        <Edit className="mr-2 h-4 w-4" />
                        Manage Team
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              {/* Security Tab */}
              <TabsContent value="security" className="mt-0">
                <Card className="border-none shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>
                      Manage your account security preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-0">
                    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
                          <Shield className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">Multi-Factor Authentication</p>
                          <p className="text-sm text-gray-500">Secure your account with 2FA</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-200">Enabled</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                          <Shield className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">Password Security</p>
                          <p className="text-sm text-gray-500">Last changed 30 days ago</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Change</Button>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4">
                    <Link href="/owner/security" className="w-full">
                      <Button variant="outline" className="w-full">
                        <Shield className="mr-2 h-4 w-4" />
                        View All Security Settings
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              {/* Documents Tab */}
              <TabsContent value="documents" className="mt-0">
                <Card className="border-none shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle>Business Documents</CardTitle>
                    <CardDescription>
                      Manage important files and documents
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-0">
                    {profile.documents.map((doc, i) => (
                      <div key={i} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                            <FileText className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">{doc.name}</p>
                            <p className="text-sm text-gray-500">Uploaded on {doc.date}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">View</Button>
                      </div>
                    ))}
                  </CardContent>
                  <CardFooter className="border-t pt-4">
                    <Button className="w-full">
                      <FileText className="mr-2 h-4 w-4" />
                      Upload New Document
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}