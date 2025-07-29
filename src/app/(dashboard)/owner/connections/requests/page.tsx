'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle2, XCircle, Building2, MapPin, Globe, MessageSquare, Clock, ExternalLink } from 'lucide-react';

export default function ConnectionRequestsPage() {
  // Incoming connection requests
  const [incomingRequests, setIncomingRequests] = useState([
    {
      id: 1,
      name: 'Quantum Technologies',
      industry: 'Technology',
      location: 'Seattle, WA',
      logo: '/placeholder.png',
      requestDate: '2025-04-10',
      message: 'We would like to explore potential partnerships in the enterprise software space.',
      contactPerson: 'Alex Thompson',
      contactTitle: 'Business Development Manager',
      contactEmail: 'alex.thompson@quantumtech.com',
      website: 'www.quantumtech.com',
    },
    {
      id: 2,
      name: 'Green Energy Solutions',
      industry: 'Energy',
      location: 'Portland, OR',
      logo: '/placeholder.png',
      requestDate: '2025-04-08',
      message: 'Looking to connect with other businesses focused on sustainability.',
      contactPerson: 'Jessica Martinez',
      contactTitle: 'COO',
      contactEmail: 'jmartinez@greenenergy.com',
      website: 'www.greenenergy.com',
    },
  ]);

  // Outgoing connection requests
  const [outgoingRequests, setOutgoingRequests] = useState([
    {
      id: 3,
      name: 'Strategic Consulting Group',
      industry: 'Consulting',
      location: 'Chicago, IL',
      logo: '/placeholder.png',
      requestDate: '2025-04-12',
      message: 'Would love to discuss potential collaboration on upcoming projects.',
      contactPerson: 'Mark Wilson',
      contactTitle: 'Partner',
      contactEmail: 'mark.wilson@strategiccg.com',
      website: 'www.strategiccg.com',
    },
    {
      id: 4,
      name: 'DataViz Analytics',
      industry: 'Data Analytics',
      location: 'Austin, TX',
      logo: '/placeholder.png',
      requestDate: '2025-04-05',
      message: 'Interested in exploring integration opportunities with your platform.',
      contactPerson: 'Priya Sharma',
      contactTitle: 'CEO',
      contactEmail: 'psharma@dataviz.io',
      website: 'www.dataviz.io',
    },
  ]);

  // Handle accepting a connection request
  const handleAccept = (requestId: number) => {
    setIncomingRequests(prev => prev.filter(request => request.id !== requestId));
    // In a real app, you would also call an API to accept the connection
  };

  // Handle rejecting a connection request
  const handleReject = (requestId: number) => {
    setIncomingRequests(prev => prev.filter(request => request.id !== requestId));
    // In a real app, you would also call an API to reject the connection
  };

  // Handle canceling an outgoing request
  const handleCancel = (requestId: number) => {
    setOutgoingRequests(prev => prev.filter(request => request.id !== requestId));
    // In a real app, you would also call an API to cancel the request
  };

  return (
    <div className="container p-6 mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Connection Requests</h1>
      </div>

      <Tabs defaultValue="incoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="incoming">
            Incoming Requests
            {incomingRequests.length > 0 && (
              <span className="ml-2 bg-primary dark:text-black text-xs font-medium px-2 py-0.5 rounded-full">
                {incomingRequests.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="outgoing">
            Outgoing Requests
            {outgoingRequests.length > 0 && (
              <span className="ml-2 bg-primary dark:text-black text-xs font-medium px-2 py-0.5 rounded-full">
                {outgoingRequests.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="incoming" className="space-y-4">
          {incomingRequests.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="text-muted-foreground text-center">
                  <p>You do not have any incoming connection requests.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {incomingRequests.map((request) => (
                <Card key={request.id}>
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={request.logo} alt={request.name} />
                            <AvatarFallback>{request.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{request.name}</div>
                            <div className="text-sm text-muted-foreground flex items-center">
                              <Building2 className="h-3.5 w-3.5 mr-1" />
                              {request.industry}
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center text-muted-foreground">
                            <MapPin className="h-3.5 w-3.5 mr-1" />
                            {request.location}
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <Globe className="h-3.5 w-3.5 mr-1" />
                            {request.website}
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <Clock className="h-3.5 w-3.5 mr-1" />
                            Requested on {new Date(request.requestDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3 md:col-span-2">
                        <div>
                          <div className="font-medium">Contact Person</div>
                          <div className="text-sm">{request.contactPerson}, {request.contactTitle}</div>
                          <div className="text-sm text-muted-foreground">{request.contactEmail}</div>
                        </div>
                        
                        <div>
                          <div className="font-medium">Message</div>
                          <div className="text-sm mt-1 p-3 border rounded-md">
                            <div className="flex items-start">
                              <MessageSquare className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                              <p>{request.message}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-3 mt-4">
                          <Button 
                            className="flex-1" 
                            onClick={() => handleAccept(request.id)}
                          >
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Accept Request
                          </Button>
                          <Button 
                            variant="outline" 
                            className="flex-1" 
                            onClick={() => handleReject(request.id)}
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Decline
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="outgoing" className="space-y-4">
          {outgoingRequests.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="text-muted-foreground text-center">
                  <p>You do not have any outgoing connection requests.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {outgoingRequests.map((request) => (
                <Card key={request.id}>
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={request.logo} alt={request.name} />
                            <AvatarFallback>{request.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{request.name}</div>
                            <div className="text-sm text-muted-foreground flex items-center">
                              <Building2 className="h-3.5 w-3.5 mr-1" />
                              {request.industry}
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center text-muted-foreground">
                            <MapPin className="h-3.5 w-3.5 mr-1" />
                            {request.location}
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <Globe className="h-3.5 w-3.5 mr-1" />
                            {request.website}
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <Clock className="h-3.5 w-3.5 mr-1" />
                            Sent on {new Date(request.requestDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3 md:col-span-2">
                        <div>
                          <div className="font-medium">Contact Person</div>
                          <div className="text-sm">{request.contactPerson}, {request.contactTitle}</div>
                          <div className="text-sm text-muted-foreground">{request.contactEmail}</div>
                        </div>
                        
                        <div>
                          <div className="font-medium">Your Message</div>
                          <div className="text-sm mt-1 p-3 border rounded-md">
                            <div className="flex items-start">
                              <MessageSquare className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                              <p>{request.message}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-3 mt-4">
                          <Button 
                            variant="outline" 
                            className="flex-1" 
                            onClick={() => handleCancel(request.id)}
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Cancel Request
                          </Button>
                          <Button 
                            variant="secondary" 
                            className="flex-1"
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Profile
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}