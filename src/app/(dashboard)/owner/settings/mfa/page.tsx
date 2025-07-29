'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { 
  SmartphoneNfc, QrCode, Shield, Smartphone, MessageSquare, CheckCircle2, 
  AlertTriangle, Copy, ArrowRight, Download, RefreshCw, Info
} from 'lucide-react';

export default function MFASetupPage() {
  const router = useRouter();
  
  // MFA state
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [authenticatorEnabled, setAuthenticatorEnabled] = useState(false);
  const [smsEnabled, setSmsEnabled] = useState(true);
  
  // Phone for SMS verification
  const [phone, setPhone] = useState('+1 (555) 123-4567');
  const [editingPhone, setEditingPhone] = useState(false);
  const [newPhone, setNewPhone] = useState('');
  
  // Verification codes
  const [verificationCode, setVerificationCode] = useState('');
  const [recoveryCodes, setRecoveryCodes] = useState([
    'ABCD-EFGH-IJKL-MNOP',
    'QRST-UVWX-YZ12-3456',
    '7890-ABCD-EFGH-IJKL',
    'MNOP-QRST-UVWX-YZ12',
    '3456-7890-ABCD-EFGH',
  ]);
  
  // For the authenticator app setup
  const qrCodeUrl = '/qr-placeholder.png'; // This would be generated on the server
  const setupKey = 'HXDMVJECYGBWRFUKQLSPTNOZA'; // This would be generated on the server
  
  // Toggle MFA
  const toggleMFA = () => {
    if (mfaEnabled) {
      // Turning off MFA requires confirmation in a real app
      if (window.confirm('Are you sure you want to disable multi-factor authentication? This will reduce the security of your account.')) {
        setMfaEnabled(false);
        setAuthenticatorEnabled(false);
        setSmsEnabled(false);
      }
    } else {
      setMfaEnabled(true);
      setSmsEnabled(true); // Default to SMS when enabling
    }
  };
  
  // Toggle authenticator app
  const toggleAuthenticator = () => {
    setAuthenticatorEnabled(!authenticatorEnabled);
  };
  
  // Toggle SMS verification
  const toggleSMS = () => {
    setSmsEnabled(!smsEnabled);
    
    // Don't allow disabling both methods
    if (smsEnabled && !authenticatorEnabled) {
      setAuthenticatorEnabled(true);
    }
  };
  
  // Start phone editing
  const startEditPhone = () => {
    setNewPhone(phone);
    setEditingPhone(true);
  };
  
  // Save new phone
  const savePhone = () => {
    setPhone(newPhone);
    setEditingPhone(false);
  };
  
  // Cancel phone editing
  const cancelEditPhone = () => {
    setEditingPhone(false);
  };
  
  // Generate new recovery codes
  const generateNewRecoveryCodes = () => {
    // In a real app, this would call the API to generate new codes
    if (window.confirm('Generating new recovery codes will invalidate your existing codes. Are you sure you want to continue?')) {
      alert('New recovery codes generated!');
    }
  };
  
  // Copy text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };
  
  return (
    <div className="container p-6 mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Multi-Factor Authentication</h1>
        <Button variant="outline" onClick={() => router.push('/owner/settings')}>
          Back to Settings
        </Button>
      </div>
      
      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-600">Enhanced Security</AlertTitle>
        <AlertDescription className="text-blue-700">
          Multi-factor authentication adds an extra layer of security to your account by requiring a second verification method in addition to your password.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5 text-primary" />
            MFA Status
          </CardTitle>
          <CardDescription>
            Enable or disable multi-factor authentication for your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="mfa-toggle">Multi-Factor Authentication</Label>
              <div className="text-sm text-muted-foreground">
                Require a second verification factor when logging in
              </div>
            </div>
            <Switch 
              id="mfa-toggle" 
              checked={mfaEnabled} 
              onCheckedChange={toggleMFA}
            />
          </div>
          
          {mfaEnabled && (
            <Alert variant={mfaEnabled ? "default" : "destructive"} className={mfaEnabled ? "bg-green-50 border-green-200" : ""}>
              {mfaEnabled ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <AlertTriangle className="h-4 w-4" />
              )}
              <AlertTitle className={mfaEnabled ? "text-green-600" : ""}>
                {mfaEnabled ? "MFA is enabled" : "MFA is disabled"}
              </AlertTitle>
              <AlertDescription className={mfaEnabled ? "text-green-700" : ""}>
                {mfaEnabled 
                  ? "Your account is protected with multi-factor authentication." 
                  : "Your account is not protected with multi-factor authentication. We strongly recommend enabling this feature."
                }
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {mfaEnabled && (
        <Tabs defaultValue="methods" className="space-y-4">
          <TabsList>
            <TabsTrigger value="methods">
              <Smartphone className="mr-2 h-4 w-4" />
              Verification Methods
            </TabsTrigger>
            <TabsTrigger value="recovery">
              <Shield className="mr-2 h-4 w-4" />
              Recovery Codes
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="methods" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5 text-primary" />
                  SMS Verification
                </CardTitle>
                <CardDescription>
                  Receive a verification code via text message
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sms-toggle">SMS Authentication</Label>
                    <div className="text-sm text-muted-foreground">
                      Receive verification codes via SMS
                    </div>
                  </div>
                  <Switch 
                    id="sms-toggle" 
                    checked={smsEnabled} 
                    onCheckedChange={toggleSMS}
                  />
                </div>
                
                {smsEnabled && (
                  <div className="mt-4 space-y-4">
                    <div className="space-y-2">
                      <Label>Verified Phone Number</Label>
                      {editingPhone ? (
                        <div className="flex gap-2">
                          <Input 
                            value={newPhone} 
                            onChange={(e) => setNewPhone(e.target.value)} 
                            placeholder="Enter phone number"
                          />
                          <Button onClick={savePhone}>Save</Button>
                          <Button variant="ghost" onClick={cancelEditPhone}>Cancel</Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="font-medium">{phone}</div>
                          <Button variant="outline" onClick={startEditPhone}>Change</Button>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="test-sms">Test SMS Verification</Label>
                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1">
                          Send Test Code
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <SmartphoneNfc className="mr-2 h-5 w-5 text-primary" />
                  Authenticator App
                </CardTitle>
                <CardDescription>
                  Use an authenticator app like Google Authenticator or Authy
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auth-toggle">Authenticator App</Label>
                    <div className="text-sm text-muted-foreground">
                      Use a time-based one-time password (TOTP) app
                    </div>
                  </div>
                  <Switch 
                    id="auth-toggle" 
                    checked={authenticatorEnabled} 
                    onCheckedChange={toggleAuthenticator}
                  />
                </div>
                
                {authenticatorEnabled && (
                  <div className="mt-4 space-y-4">
                    <div className="space-y-2">
                      <Label>Setup Instructions</Label>
                      <ol className="list-decimal pl-5 space-y-2 text-sm">
                        <li>Download and install an authenticator app like Google Authenticator or Authy</li>
                        <li>Scan the QR code below or enter the setup key manually</li>
                        <li>Enter the verification code generated by the app to complete setup</li>
                      </ol>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-6 items-center justify-center md:justify-between p-4 border rounded-lg">
                      <div className="flex flex-col items-center">
                        <QrCode className="h-12 w-12 mb-2 text-primary" />
                        <div className="text-center">
                          <p className="text-sm font-medium mb-2">Scan QR Code</p>
                          <img src={qrCodeUrl} alt="QR Code" className="w-40 h-40 border rounded-lg" />
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <ArrowRight className="hidden md:block h-12 w-12 mb-2 text-muted-foreground" />
                        <div className="md:hidden h-px w-20 bg-muted my-2"></div>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <RefreshCw className="h-12 w-12 mb-2 text-primary" />
                        <div className="text-center">
                          <p className="text-sm font-medium mb-2">Manual Entry Key</p>
                          <div className="flex items-center mb-2">
                            <code className="bg-muted p-2 rounded text-xs font-mono">
                              {setupKey}
                            </code>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => copyToClipboard(setupKey)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="verification-code">Verification Code</Label>
                      <div className="flex gap-2">
                        <Input 
                          id="verification-code" 
                          value={verificationCode} 
                          onChange={(e) => setVerificationCode(e.target.value)}
                          placeholder="Enter code from authenticator app"
                        />
                        <Button>Verify</Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="recovery" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5 text-primary" />
                  Recovery Codes
                </CardTitle>
                <CardDescription>
                  Use these codes to access your account if you lose access to your other authentication methods
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert variant="warning" className="bg-yellow-50 border-yellow-200">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <AlertTitle className="text-yellow-600">Keep these codes safe</AlertTitle>
                  <AlertDescription className="text-yellow-700">
                    Each code can only be used once. Store these in a secure location like a password manager. Anyone with access to these codes could gain access to your account.
                  </AlertDescription>
                </Alert>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {recoveryCodes.map((code, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <code className="font-mono text-sm">{code}</code>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => copyToClipboard(code)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="flex flex-col gap-2 sm:flex-row mt-4">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => copyToClipboard(recoveryCodes.join('\n'))}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy All Codes
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Download className="mr-2 h-4 w-4" />
                    Download Codes
                  </Button>
                  <Button variant="secondary" className="flex-1" onClick={generateNewRecoveryCodes}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Generate New Codes
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  <CheckCircle2 className="inline-block h-4 w-4 mr-1 text-green-500" />
                  You have used 0 of 5 recovery codes.
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}