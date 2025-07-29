'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, UserPlus, Filter, ChevronRight, Building2, Globe, MapPin } from 'lucide-react';

export default function ConnectionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [industryFilter, setIndustryFilter] = useState('all');
  
  const connections = [
    {
      id: 1,
      name: 'Tech Solutions Inc.',
      industry: 'Software',
      status: 'active',
      location: 'San Francisco, CA',
      logo: '/placeholder.png',
      lastActivity: '2 days ago',
      contactPerson: 'Sarah Johnson',
      contactTitle: 'CEO',
      contactEmail: 'sarah@techsolutions.com',
    },
    {
      id: 2,
      name: 'Global Manufacturing Co.',
      industry: 'Manufacturing',
      status: 'active',
      location: 'Chicago, IL',
      logo: '/placeholder.png',
      lastActivity: '1 week ago',
      contactPerson: 'Michael Chen',
      contactTitle: 'Operations Director',
      contactEmail: 'mchen@globalmanufacturing.com',
    },
    {
      id: 3,
      name: 'Pinnacle Financial Group',
      industry: 'Finance',
      status: 'active',
      location: 'New York, NY',
      logo: '/placeholder.png',
      lastActivity: '3 days ago',
      contactPerson: 'Robert Kim',
      contactTitle: 'CFO',
      contactEmail: 'r.kim@pinnaclefinancial.com',
    },
    {
      id: 4,
      name: 'Healthcare Innovations',
      industry: 'Healthcare',
      status: 'active',
      location: 'Boston, MA',
      logo: '/placeholder.png',
      lastActivity: '5 days ago',
      contactPerson: 'Emily Watson',
      contactTitle: 'Director',
      contactEmail: 'e.watson@healthcareinnovations.com',
    },
    {
      id: 5,
      name: 'EduTech Solutions',
      industry: 'Education',
      status: 'inactive',
      location: 'Austin, TX',
      logo: '/placeholder.png',
      lastActivity: '2 months ago',
      contactPerson: 'David Miller',
      contactTitle: 'CEO',
      contactEmail: 'd.miller@edutech.com',
    },
  ];

  // Filter connections based on search query and industry filter
  const filteredConnections = connections.filter(connection => {
    const matchesSearch = connection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         connection.contactPerson.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry = industryFilter === 'all' || connection.industry.toLowerCase() === industryFilter.toLowerCase();
    
    return matchesSearch && matchesIndustry;
  });

  return (
    
    <div className="container p-6 mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Connections</h1>

      <div className="flex flex-col md:flex-row gap-4 ">
        <div className="flex justify-between w-full">
          <div className="relative w-1/4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search connections..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex justify-between items-center">
            <Link href="/owner/connections/requests">
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Connection Requests
                <span className="ml-2 bg-white dark:bg-black text-primary text-xs font-medium px-2 py-0.5 rounded-full">2</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Tabs defaultValue="grid" className="space-y-4">
        <div className='flex items-center justify-between mb-4'>
          <div className="w-48">
            <Select
              value={industryFilter}
              onValueChange={setIndustryFilter}
            >
              <SelectTrigger>
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Industry</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                <SelectItem value="software">Software</SelectItem>
                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="education">Education</SelectItem>
              </SelectContent>
            </Select> 
          </div>
          <TabsList>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
        </div>
        
        
        <TabsContent value="grid" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredConnections.map((connection) => (
              <Card key={connection.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={connection.logo} alt={connection.name} />
                      <AvatarFallback>{connection.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{connection.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        {connection.industry}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 pt-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    {connection.location}
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">{connection.contactPerson}</div>
                    <div className="text-muted-foreground">{connection.contactTitle}</div>
                  </div>
                  <div className="pt-2 flex justify-between items-center">
                    <div className="text-xs text-muted-foreground">
                      Active {connection.lastActivity}
                    </div>
                    <Link href={`/owner/connections/${connection.id}`}>
                      <Button variant="ghost" size="sm">
                        View 
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {filteredConnections.map((connection) => (
                  <div key={connection.id} className="flex items-center p-4 hover:bg-slate-50 transition-colors">
                    <Avatar className="h-10 w-10 mr-4">
                      <AvatarImage src={connection.logo} alt={connection.name} />
                      <AvatarFallback>{connection.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{connection.name}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <span>{connection.industry}</span>
                        <span>•</span>
                        <span>{connection.location}</span>
                      </div>
                    </div>
                    <div className="hidden md:block text-right text-sm">
                      <div>{connection.contactPerson}</div>
                      <div className="text-muted-foreground">{connection.contactTitle}</div>
                    </div>
                    <div className="hidden md:block text-xs text-muted-foreground mx-4 w-24 text-right">
                      Active {connection.lastActivity}
                    </div>
                    <Link href={`/owner/connections/${connection.id}`}>
                      <Button variant="ghost" size="icon">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}