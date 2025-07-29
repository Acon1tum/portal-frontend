'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Bell, MessageSquare, Users, Lock, Mail, Smartphone, CheckCircle2, 
  AlertTriangle, Save, Info
} from 'lucide-react';

export default function NotificationSettingsPage() {
  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    // Platform notifications
    connectionRequests: true,
    connectionAccepted: true,
    newMessages: true,
    messageRead: false,
    profileViews: true,
    systemUpdates: true,
    maintenanceAlerts: true,
    
    // Security notifications
    newLogins: true,
    passwordChanges: true,
    securityAlerts: true,
    
    // Email preferences
    dailyDigest: false,
    weeklyDigest: true,
    instantAlerts: true,
    
    // Delivery preferences
    emailDelivery: true,
    browserDelivery: true,
    mobileDelivery: true,
    
    // Quiet hours
    quietHoursEnabled: false,
    quietHoursStart: '22:00',
    quietHoursEnd: '07:00',
  });

  // Handle toggle change
  const handleToggleChange = (setting: string) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev]
    }));
  };

  // Handle select change
  const handleSelectChange = (setting: string, value: string) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  // Save settings
  const saveSettings = () => {
    // In a real app, this would make an API call to save settings
    alert('Notification settings saved successfully!');
  };

  return (
    <div className="container p-6 mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Notification Settings</h1>
        <Button onClick={saveSettings}>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-600">Manage your notifications</AlertTitle>
        <AlertDescription className="text-blue-700">
          Control how and when you receive alerts about platform activity, messages, and security events.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="platform" className="space-y-4">
        <TabsList>
          <TabsTrigger value="platform">
            <Bell className="mr-2 h-4 w-4" />
            Platform
          </TabsTrigger>
          <TabsTrigger value="security">
            <Lock className="mr-2 h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="delivery">
            <Mail className="mr-2 h-4 w-4" />
            Delivery
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="platform" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-primary" />
                Connection Notifications
              </CardTitle>
              <CardDescription>
                Notifications related to your business connections
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="connectionRequests">Connection Requests</Label>
                  <p className="text-sm text-muted-foreground">
                    Notify when someone sends you a connection request
                  </p>
                </div>
                <Switch 
                  id="connectionRequests" 
                  checked={notificationSettings.connectionRequests}
                  onCheckedChange={() => handleToggleChange('connectionRequests')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="connectionAccepted">Connection Accepted</Label>
                  <p className="text-sm text-muted-foreground">
                    Notify when someone accepts your connection request
                  </p>
                </div>
                <Switch 
                  id="connectionAccepted" 
                  checked={notificationSettings.connectionAccepted}
                  onCheckedChange={() => handleToggleChange('connectionAccepted')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="profileViews">Profile Views</Label>
                  <p className="text-sm text-muted-foreground">
                    Notify when someone views your business profile
                  </p>
                </div>
                <Switch 
                  id="profileViews" 
                  checked={notificationSettings.profileViews}
                  onCheckedChange={() => handleToggleChange('profileViews')}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="mr-2 h-5 w-5 text-primary" />
                Message Notifications
              </CardTitle>
              <CardDescription>
                Notifications related to your messages and conversations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="newMessages">New Messages</Label>
                  <p className="text-sm text-muted-foreground">
                    Notify when you receive a new message
                  </p>
                </div>
                <Switch 
                  id="newMessages" 
                  checked={notificationSettings.newMessages}
                  onCheckedChange={() => handleToggleChange('newMessages')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="messageRead">Message Read Receipts</Label>
                  <p className="text-sm text-muted-foreground">
                    Notify when someone reads your message
                  </p>
                </div>
                <Switch 
                  id="messageRead" 
                  checked={notificationSettings.messageRead}
                  onCheckedChange={() => handleToggleChange('messageRead')}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5 text-primary" />
                System Notifications
              </CardTitle>
              <CardDescription>
                Platform updates and maintenance alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="systemUpdates">System Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Notify about new features and platform updates
                  </p>
                </div>
                <Switch 
                  id="systemUpdates" 
                  checked={notificationSettings.systemUpdates}
                  onCheckedChange={() => handleToggleChange('systemUpdates')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="maintenanceAlerts">Maintenance Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Notify about scheduled maintenance and potential downtime
                  </p>
                </div>
                <Switch 
                  id="maintenanceAlerts" 
                  checked={notificationSettings.maintenanceAlerts}
                  onCheckedChange={() => handleToggleChange('maintenanceAlerts')}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="mr-2 h-5 w-5 text-primary" />
                Security Notifications
              </CardTitle>
              <CardDescription>
                Notifications related to account security and activity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="newLogins">New Login Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Notify when your account is accessed from a new device or location
                  </p>
                </div>
                <Switch 
                  id="newLogins" 
                  checked={notificationSettings.newLogins}
                  onCheckedChange={() => handleToggleChange('newLogins')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="passwordChanges">Password Changes</Label>
                  <p className="text-sm text-muted-foreground">
                    Notify when your password is changed
                  </p>
                </div>
                <Switch 
                  id="passwordChanges" 
                  checked={notificationSettings.passwordChanges}
                  onCheckedChange={() => handleToggleChange('passwordChanges')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="securityAlerts">Security Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Notify about suspicious activity and security concerns
                  </p>
                </div>
                <Switch 
                  id="securityAlerts" 
                  checked={notificationSettings.securityAlerts}
                  onCheckedChange={() => handleToggleChange('securityAlerts')}
                />
              </div>
              
              <Alert variant="destructive" className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  For your security, some critical security alerts cannot be disabled.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="delivery" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="mr-2 h-5 w-5 text-primary" />
                Email Preferences
              </CardTitle>
              <CardDescription>
                How often you receive email notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="instantAlerts">Instant Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive immediate email notifications for important events
                  </p>
                </div>
                <Switch 
                  id="instantAlerts" 
                  checked={notificationSettings.instantAlerts}
                  onCheckedChange={() => handleToggleChange('instantAlerts')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dailyDigest">Daily Digest</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive a daily summary of all notifications
                  </p>
                </div>
                <Switch 
                  id="dailyDigest" 
                  checked={notificationSettings.dailyDigest}
                  onCheckedChange={() => handleToggleChange('dailyDigest')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="weeklyDigest">Weekly Digest</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive a weekly summary of all notifications
                  </p>
                </div>
                <Switch 
                  id="weeklyDigest" 
                  checked={notificationSettings.weeklyDigest}
                  onCheckedChange={() => handleToggleChange('weeklyDigest')}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5 text-primary" />
                Delivery Methods
              </CardTitle>
              <CardDescription>
                How you want to receive your notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="emailDelivery">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch 
                  id="emailDelivery" 
                  checked={notificationSettings.emailDelivery}
                  onCheckedChange={() => handleToggleChange('emailDelivery')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="browserDelivery">Browser Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive desktop notifications when using the platform
                  </p>
                </div>
                <Switch 
                  id="browserDelivery" 
                  checked={notificationSettings.browserDelivery}
                  onCheckedChange={() => handleToggleChange('browserDelivery')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="mobileDelivery">Mobile Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive push notifications on your mobile device
                  </p>
                </div>
                <Switch 
                  id="mobileDelivery" 
                  checked={notificationSettings.mobileDelivery}
                  onCheckedChange={() => handleToggleChange('mobileDelivery')}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Smartphone className="mr-2 h-5 w-5 text-primary" />
                Quiet Hours
              </CardTitle>
              <CardDescription>
                Set times when you don't want to be disturbed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="quietHoursEnabled">Enable Quiet Hours</Label>
                  <p className="text-sm text-muted-foreground">
                    Silence notifications during specified hours
                  </p>
                </div>
                <Switch 
                  id="quietHoursEnabled" 
                  checked={notificationSettings.quietHoursEnabled}
                  onCheckedChange={() => handleToggleChange('quietHoursEnabled')}
                />
              </div>
              
              {notificationSettings.quietHoursEnabled && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="quietHoursStart">Start Time</Label>
                    <Select 
                      value={notificationSettings.quietHoursStart}
                      onValueChange={(value) => handleSelectChange('quietHoursStart', value)}
                    >
                      <SelectTrigger id="quietHoursStart">
                        <SelectValue placeholder="Select start time" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 }).map((_, i) => (
                          <SelectItem 
                            key={i} 
                            value={`${String(i).padStart(2, '0')}:00`}
                          >
                            {`${String(i).padStart(2, '0')}:00`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quietHoursEnd">End Time</Label>
                    <Select 
                      value={notificationSettings.quietHoursEnd}
                      onValueChange={(value) => handleSelectChange('quietHoursEnd', value)}
                    >
                      <SelectTrigger id="quietHoursEnd">
                        <SelectValue placeholder="Select end time" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 }).map((_, i) => (
                          <SelectItem 
                            key={i} 
                            value={`${String(i).padStart(2, '0')}:00`}
                          >
                            {`${String(i).padStart(2, '0')}:00`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                <CheckCircle2 className="inline h-4 w-4 mr-1 text-green-500" />
                Critical security alerts will still be delivered during quiet hours.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}