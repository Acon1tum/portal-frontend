'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Shield, Smartphone, Lock, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

export default function SecurityPage() {
  return (
    <div className="container p-6 mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Security Settings</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="mr-2 h-5 w-5 text-primary" />
              Account Security
            </CardTitle>
            <CardDescription>
              Manage your account security settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="password-change">Password Management</Label>
                <div className="text-sm text-muted-foreground">Last changed 30 days ago</div>
              </div>
              <Link href="/owner/settings/password">
                <Button variant="outline" size="sm">Change Password</Button>
              </Link>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="security-questions">Security Questions</Label>
                <div className="text-sm text-muted-foreground">Additional account recovery options</div>
              </div>
              <Button variant="outline" size="sm">Update</Button>
            </div>
            
            <Alert variant="default" className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertTitle className="text-orange-600">Action Required</AlertTitle>
              <AlertDescription className="text-orange-700">
                We recommend updating your password regularly and setting up MFA to secure your account.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Smartphone className="mr-2 h-5 w-5 text-primary" />
              Multi-Factor Authentication
            </CardTitle>
            <CardDescription>
              Enhance your account security with MFA
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="mfa-toggle">MFA Protection</Label>
                <div className="text-sm text-muted-foreground">Enable additional security for logins</div>
              </div>
              <Switch id="mfa-toggle" defaultChecked={true} />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="phone-mfa">Phone Authentication</Label>
                <div className="text-sm text-muted-foreground">Receive a code via SMS</div>
              </div>
              <Switch id="phone-mfa" defaultChecked={true} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="app-mfa">Authenticator App</Label>
                <div className="text-sm text-muted-foreground">Use an authentication app</div>
              </div>
              <Switch id="app-mfa" defaultChecked={false} />
            </div>
            
            <Link href="/owner/settings/mfa">
              <Button variant="outline" className="w-full">
                <Shield className="mr-2 h-4 w-4" />
                Configure MFA Settings
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle2 className="mr-2 h-5 w-5 text-primary" />
              Login Activity
            </CardTitle>
            <CardDescription>
              Monitor and manage your login sessions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="p-3 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="font-medium">Current Session</div>
                  <div className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">Active</div>
                </div>
                <div className="text-sm text-muted-foreground mt-1">San Francisco, CA • Chrome on Windows</div>
                <div className="text-xs text-muted-foreground mt-1 flex items-center">
                  <Clock className="mr-1 h-3 w-3" />
                  Started 2 hours ago
                </div>
              </div>
              
              <div className="p-3 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="font-medium">Previous Login</div>
                  <div className="text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded-full">Ended</div>
                </div>
                <div className="text-sm text-muted-foreground mt-1">New York, NY • Safari on macOS</div>
                <div className="text-xs text-muted-foreground mt-1 flex items-center">
                  <Clock className="mr-1 h-3 w-3" />
                  2 days ago
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/owner/notifications/activity" className="w-full">
              <Button variant="outline" className="w-full">
                View All Login Activity
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-primary" />
              Security Notifications
            </CardTitle>
            <CardDescription>
              Choose how you want to be alerted about security events
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="new-login-notify">New Login Alerts</Label>
                <div className="text-sm text-muted-foreground">Notify when new device logs in</div>
              </div>
              <Switch id="new-login-notify" defaultChecked={true} />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="password-change-notify">Password Change Alerts</Label>
                <div className="text-sm text-muted-foreground">Notify when password is changed</div>
              </div>
              <Switch id="password-change-notify" defaultChecked={true} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="security-events-notify">Security Events</Label>
                <div className="text-sm text-muted-foreground">Notify about suspicious activity</div>
              </div>
              <Switch id="security-events-notify" defaultChecked={true} />
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/owner/notifications/settings">
              <Button variant="outline" className="w-full">
                Manage Notification Preferences
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}