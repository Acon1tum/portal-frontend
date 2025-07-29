'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Clock, Monitor, Smartphone, MapPin, LogOut, AlertTriangle, 
  CheckCircle2, ShieldAlert, Filter, Info, MoreHorizontal
} from 'lucide-react';

export default function LoginActivityPage() {
  // Login activity data
  const [loginActivities, setLoginActivities] = useState([
    {
      id: 1,
      device: 'Chrome on Windows 10',
      deviceType: 'desktop',
      location: 'San Francisco, CA',
      ip: '192.168.1.1',
      time: '2025-04-16T10:30:00',
      status: 'active',
      verified: true,
    },
    {
      id: 2,
      device: 'Safari on macOS',
      deviceType: 'desktop',
      location: 'New York, NY',
      ip: '172.16.254.1',
      time: '2025-04-14T16:45:00',
      status: 'ended',
      verified: true,
    },
    {
      id: 3,
      device: 'Firefox on Windows 11',
      deviceType: 'desktop',
      location: 'Chicago, IL',
      ip: '10.0.0.1',
      time: '2025-04-10T09:15:00',
      status: 'ended',
      verified: true,
    },
    {
      id: 4,
      device: 'Chrome on Android',
      deviceType: 'mobile',
      location: 'San Francisco, CA',
      ip: '192.168.0.2',
      time: '2025-04-08T14:22:00',
      status: 'ended',
      verified: true,
    },
    {
      id: 5,
      device: 'Safari on iOS',
      deviceType: 'mobile',
      location: 'Denver, CO',
      ip: '172.20.10.2',
      time: '2025-04-01T11:47:00',
      status: 'ended',
      verified: false,
    },
  ]);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  };

  // Get device icon
  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'desktop':
        return <Monitor className="h-4 w-4" />;
      case 'mobile':
        return <Smartphone className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  // End session
  const endSession = (sessionId: number) => {
    setLoginActivities(prev => 
      prev.map(activity => 
        activity.id === sessionId ? { ...activity, status: 'ended' } : activity
      )
    );
  };

  // Filter by device type
  const [deviceFilter, setDeviceFilter] = useState('all');
  
  const filteredActivities = loginActivities.filter(activity => {
    if (deviceFilter === 'all') return true;
    return activity.deviceType === deviceFilter;
  });

  // Active sessions
  const activeSessions = filteredActivities.filter(activity => activity.status === 'active');
  const previousSessions = filteredActivities.filter(activity => activity.status === 'ended');

  return (
    <div className="container p-6 mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Login Activity</h1>
        <div className="flex gap-2">
          <Select
            value={deviceFilter}
            onValueChange={setDeviceFilter}
          >
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Device Type</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Devices</SelectItem>
              <SelectItem value="desktop">Desktop</SelectItem>
              <SelectItem value="mobile">Mobile</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-600">Monitor your account activity</AlertTitle>
        <AlertDescription className="text-blue-700">
          Review your login history and active sessions. If you notice any suspicious activity, end the session and change your password immediately.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">
            Active Sessions
            {activeSessions.length > 0 && (
              <span className="ml-2 bg-primary text-white text-xs font-medium px-2 py-0.5 rounded-full">
                {activeSessions.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="previous">Previous Logins</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>
                Devices currently logged into your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeSessions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <Info className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No active sessions</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    There are no other active sessions besides your current one.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeSessions.map((session) => (
                    <div 
                      key={session.id} 
                      className="p-4 border rounded-lg"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-700 mr-4">
                              {getDeviceIcon(session.deviceType)}
                            </div>
                            <div>
                              <div className="font-medium">{session.device}</div>
                              <div className="text-sm text-muted-foreground flex items-center mt-0.5">
                                <MapPin className="h-3.5 w-3.5 mr-1" />
                                {session.location} • IP: {session.ip}
                              </div>
                              <div className="text-xs text-muted-foreground flex items-center mt-1">
                                <Clock className="h-3 w-3 mr-1" />
                                {formatDate(session.time)}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700 mr-4">
                              Active
                            </span>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline">
                                  <LogOut className="mr-2 h-4 w-4" />
                                  End Session
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>End Session</DialogTitle>
                                  <DialogDescription>
                                    Are you sure you want to end this session? You'll need to log in again on that device.
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                  <Button variant="outline" onClick={() => {}}>Cancel</Button>
                                  <Button variant="destructive" onClick={() => endSession(session.id)}>End Session</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="previous">
            <Card>
              <CardHeader>
                <CardTitle>Previous Logins</CardTitle>
                <CardDescription>
                  Recent login history for your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {previousSessions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <Info className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">No login history</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        There are no previous login sessions recorded.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {previousSessions.map((session) => (
                        <div 
                          key={session.id} 
                          className={`p-4 border rounded-lg ${!session.verified ? 'border-yellow-200 bg-yellow-50' : ''}`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-700 mr-4">
                                {getDeviceIcon(session.deviceType)}
                              </div>
                              <div>
                                <div className="font-medium flex items-center">
                                  {session.device}
                                  {!session.verified && (
                                    <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-700">
                                      Unverified
                                    </span>
                                  )}
                                </div>
                                <div className="text-sm text-muted-foreground flex items-center mt-0.5">
                                  <MapPin className="h-3.5 w-3.5 mr-1" />
                                  {session.location} • IP: {session.ip}
                                </div>
                                <div className="text-xs text-muted-foreground flex items-center mt-1">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {formatDate(session.time)}
                                </div>
                              </div>
                            </div>
                            <div>
                              {!session.verified ? (
                                <Button variant="outline" size="sm" className="text-yellow-600">
                                  <AlertTriangle className="mr-2 h-4 w-4" />
                                  Report
                                </Button>
                              ) : (
                                <span className="px-2 py-1 text-xs rounded-full bg-slate-100 text-slate-700">
                                  Ended
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
  
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShieldAlert className="mr-2 h-5 w-5 text-primary" />
              Security Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
              <div>
                <div className="font-medium text-green-800">Multi-Factor Authentication enabled</div>
                <p className="text-sm text-green-700">
                  Your account is secured with multi-factor authentication.
                </p>
              </div>
            </div>
            
            <div className="flex items-start p-3 border rounded-lg">
              <Info className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
              <div>
                <div className="font-medium">Security best practices</div>
                <ul className="text-sm text-muted-foreground space-y-1 mt-1 ml-1">
                  <li>• Only log in from trusted devices and networks</li>
                  <li>• Log out when using shared computers</li>
                  <li>• Regularly review your login activity</li>
                  <li>• Update your password every 90 days</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }