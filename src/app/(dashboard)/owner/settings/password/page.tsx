'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Lock, Eye, EyeOff, Save, Info, CheckCircle2, X } from 'lucide-react';

export default function PasswordPage() {
  const router = useRouter();
  
  // Form state
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Password visibility
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password strength
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState('');

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear errors when typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Calculate password strength when new password changes
    if (name === 'newPassword') {
      calculatePasswordStrength(value);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field: string) => {
    switch (field) {
      case 'current':
        setShowCurrentPassword(!showCurrentPassword);
        break;
      case 'new':
        setShowNewPassword(!showNewPassword);
        break;
      case 'confirm':
        setShowConfirmPassword(!showConfirmPassword);
        break;
    }
  };

  // Calculate password strength
  const calculatePasswordStrength = (password: string) => {
    if (!password) {
      setPasswordStrength(0);
      setPasswordFeedback('');
      return;
    }
    
    let strength = 0;
    let feedback = 'Weak password';
    
    // Length check
    if (password.length >= 8) strength += 25;
    
    // Uppercase letter check
    if (/[A-Z]/.test(password)) strength += 25;
    
    // Lowercase letter check
    if (/[a-z]/.test(password)) strength += 25;
    
    // Number or special character check
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) strength += 25;
    
    // Set feedback based on strength
    if (strength >= 100) feedback = 'Strong password';
    else if (strength >= 50) feedback = 'Moderate password';
    
    setPasswordStrength(strength);
    setPasswordFeedback(feedback);
  };

  // Get progress bar color based on password strength
  const getProgressColor = () => {
    if (passwordStrength >= 100) return 'bg-green-500';
    if (passwordStrength >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // In a real app, this would make an API call to change the password
      console.log('Password changed successfully!');
      router.push('/owner/settings');
    }
  };

  return (
    <div className="container p-6 mx-auto">
      <div className="max-w-md mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Change Password</h1>
        
        <Alert className="bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-600">Password requirements</AlertTitle>
          <AlertDescription className="text-blue-700">
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>At least 8 characters long</li>
              <li>Include at least one uppercase letter</li>
              <li>Include at least one lowercase letter</li>
              <li>Include at least one number or special character</li>
            </ul>
          </AlertDescription>
        </Alert>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="mr-2 h-5 w-5 text-primary" />
              Password Management
            </CardTitle>
            <CardDescription>
              Update your account password
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input 
                    id="currentPassword" 
                    name="currentPassword" 
                    type={showCurrentPassword ? "text" : "password"}
                    value={formData.currentPassword} 
                    onChange={handleInputChange}
                    className={errors.currentPassword ? "border-red-300 pr-10" : "pr-10"}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => togglePasswordVisibility('current')}
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.currentPassword && (
                  <p className="text-sm font-medium text-red-500 mt-1">
                    {errors.currentPassword}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input 
                    id="newPassword" 
                    name="newPassword" 
                    type={showNewPassword ? "text" : "password"}
                    value={formData.newPassword} 
                    onChange={handleInputChange}
                    className={errors.newPassword ? "border-red-300 pr-10" : "pr-10"}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => togglePasswordVisibility('new')}
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.newPassword && (
                  <p className="text-sm font-medium text-red-500 mt-1">
                    {errors.newPassword}
                  </p>
                )}
                
                {formData.newPassword && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Password Strength</span>
                      <span>{passwordFeedback}</span>
                    </div>
                    <Progress 
                      value={passwordStrength} 
                      className={`h-2 ${getProgressColor()}`} 
                    />
                    <div className="grid grid-cols-4 gap-1 mt-2">
                      <div className="flex items-center text-xs">
                        {/[A-Z]/.test(formData.newPassword) ? (
                          <CheckCircle2 className="h-3 w-3 text-green-500 mr-1" />
                        ) : (
                          <X className="h-3 w-3 text-red-500 mr-1" />
                        )}
                        Uppercase
                      </div>
                      <div className="flex items-center text-xs">
                        {/[a-z]/.test(formData.newPassword) ? (
                          <CheckCircle2 className="h-3 w-3 text-green-500 mr-1" />
                        ) : (
                          <X className="h-3 w-3 text-red-500 mr-1" />
                        )}
                        Lowercase
                      </div>
                      <div className="flex items-center text-xs">
                        {/[0-9]/.test(formData.newPassword) ? (
                          <CheckCircle2 className="h-3 w-3 text-green-500 mr-1" />
                        ) : (
                          <X className="h-3 w-3 text-red-500 mr-1" />
                        )}
                        Number
                      </div>
                      <div className="flex items-center text-xs">
                        {formData.newPassword.length >= 8 ? (
                          <CheckCircle2 className="h-3 w-3 text-green-500 mr-1" />
                        ) : (
                          <X className="h-3 w-3 text-red-500 mr-1" />
                        )}
                        8+ chars
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input 
                    id="confirmPassword" 
                    name="confirmPassword" 
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword} 
                    onChange={handleInputChange}
                    className={errors.confirmPassword ? "border-red-300 pr-10" : "pr-10"}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => togglePasswordVisibility('confirm')}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm font-medium text-red-500 mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
                Change Password
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}