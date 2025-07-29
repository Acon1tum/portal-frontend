'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Save, User, Lock, Bell, Globe, Languages, PenLine, Clock,
  SunMedium, MoonStar, Monitor
} from 'lucide-react';

export default function SettingsPage() {
  // General settings state
  const [settings, setSettings] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    language: 'en-US',
    timezone: 'America/New_York',
    theme: 'system',
    emailNotifications: true,
    marketingEmails: false,
    autoSave: true,
  });

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  // Handle toggle change
  const handleToggleChange = (name: string) => {
    setSettings(prev => ({ ...prev, [name]: !prev[name as keyof typeof prev] }));
  };

  // Save settings
  const saveSettings = () => {
    // In a real app, this would make an API call to save settings
    alert('Settings saved successfully!');
  };

  return (
    <div className="container p-6 mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Settings</h1>
        <Button onClick={saveSettings}>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5 text-primary" />
              Account Settings
            </CardTitle>
            <CardDescription>
              Manage your account information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input 
                  id="firstName" 
                  name="firstName" 
                  value={settings.firstName} 
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input 
                  id="lastName" 
                  name="lastName" 
                  value={settings.lastName} 
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                name="email" 
                value={settings.email} 
                onChange={handleInputChange}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Link href="/owner/profile">
              <Button variant="outline">
                <PenLine className="mr-2 h-4 w-4" />
                Edit Full Profile
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="mr-2 h-5 w-5 text-primary" />
              Security Settings
            </CardTitle>
            <CardDescription>
              Manage your account security
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">Password</div>
                <div className="text-sm text-muted-foreground">Last changed 30 days ago</div>
              </div>
              <Link href="/owner/settings/password">
                <Button variant="outline">Change</Button>
              </Link>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">Multi-Factor Authentication</div>
                <div className="text-sm text-muted-foreground">Enabled</div>
              </div>
              <Link href="/owner/settings/mfa">
                <Button variant="outline">Manage</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5 text-primary" />
              Notification Preferences
            </CardTitle>
            <CardDescription>
              Manage how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="emailNotifications">Email Notifications</Label>
                <div className="text-sm text-muted-foreground">Receive email notifications</div>
              </div>
              <Switch 
                id="emailNotifications" 
                checked={settings.emailNotifications}
                onCheckedChange={() => handleToggleChange('emailNotifications')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="marketingEmails">Marketing Emails</Label>
                <div className="text-sm text-muted-foreground">Receive marketing emails</div>
              </div>
              <Switch 
                id="marketingEmails" 
                checked={settings.marketingEmails}
                onCheckedChange={() => handleToggleChange('marketingEmails')}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Link href="/owner/notifications/settings">
              <Button variant="outline">
                Advanced Settings
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="mr-2 h-5 w-5 text-primary" />
              Regional Settings
            </CardTitle>
            <CardDescription>
              Manage your language and region preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select 
                value={settings.language}
                onValueChange={(value) => handleSelectChange('language', value)}
              >
                <SelectTrigger id="language">
                  <SelectValue>
                    <div className="flex items-center">
                      <Languages className="mr-2 h-4 w-4" />
                      {settings.language === 'en-US' ? 'English (US)' : 
                       settings.language === 'es-ES' ? 'Spanish' :
                       settings.language === 'fr-FR' ? 'French' : 'Select language'}
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en-US">English (US)</SelectItem>
                  <SelectItem value="es-ES">Spanish</SelectItem>
                  <SelectItem value="fr-FR">French</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select 
                value={settings.timezone}
                onValueChange={(value) => handleSelectChange('timezone', value)}
              >
                <SelectTrigger id="timezone">
                  <SelectValue>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      {settings.timezone === 'America/New_York' ? 'Eastern Time (ET)' : 
                       settings.timezone === 'America/Chicago' ? 'Central Time (CT)' :
                       settings.timezone === 'America/Denver' ? 'Mountain Time (MT)' :
                       settings.timezone === 'America/Los_Angeles' ? 'Pacific Time (PT)' : 'Select timezone'}
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                  <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Monitor className="mr-2 h-5 w-5 text-primary" />
              Display Settings
            </CardTitle>
            <CardDescription>
              Customize your display preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <div className="grid grid-cols-3 gap-4">
                <Button
                  variant={settings.theme === 'light' ? 'default' : 'outline'}
                  className="flex flex-col items-center justify-center h-24 gap-2"
                  onClick={() => handleSelectChange('theme', 'light')}
                >
                  <SunMedium className="h-8 w-8" />
                  <span>Light</span>
                </Button>
                <Button
                  variant={settings.theme === 'dark' ? 'default' : 'outline'}
                  className="flex flex-col items-center justify-center h-24 gap-2"
                  onClick={() => handleSelectChange('theme', 'dark')}
                >
                  <MoonStar className="h-8 w-8" />
                  <span>Dark</span>
                </Button>
                <Button
                  variant={settings.theme === 'system' ? 'default' : 'outline'}
                  className="flex flex-col items-center justify-center h-24 gap-2"
                  onClick={() => handleSelectChange('theme', 'system')}
                >
                  <Monitor className="h-8 w-8" />
                  <span>System</span>
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="autoSave">Auto-Save</Label>
                <div className="text-sm text-muted-foreground">Automatically save changes</div>
              </div>
              <Switch 
                id="autoSave" 
                checked={settings.autoSave}
                onCheckedChange={() => handleToggleChange('autoSave')}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}