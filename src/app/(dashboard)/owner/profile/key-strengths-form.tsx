'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';
import { ProfileImageEditor } from '@/components/custom-ui/profile/ProfileImageEditor';
import { useAuth } from '@/lib/auth-context';

type KeyStrength = {
  id: string;
  title: string;
  description: string;
};

interface KeyStrengthsFormProps {
  initialStrengths?: KeyStrength[];
  onUpdate?: (strengths: KeyStrength[]) => void;
}

export default function KeyStrengthsForm({ 
  initialStrengths = [], 
  onUpdate 
}: KeyStrengthsFormProps) {
  const { user } = useAuth();
  const [strengths, setStrengths] = useState<KeyStrength[]>(
    initialStrengths.length > 0 
      ? initialStrengths 
      : [
          { id: crypto.randomUUID(), title: '', description: '' },
          { id: crypto.randomUUID(), title: '', description: '' },
          { id: crypto.randomUUID(), title: '', description: '' }
        ]
  );

  const [profilePicture, setProfilePicture] = useState<string | undefined>(user?.profilePicture);
  const [coverPhoto, setCoverPhoto] = useState<string | undefined>(user?.coverPhoto);

  // Update local state when user data changes
  useEffect(() => {
    if (user) {
      setProfilePicture(user.profilePicture);
      setCoverPhoto(user.coverPhoto);
    }
  }, [user]);

  const handleStrengthChange = (id: string, field: keyof KeyStrength, value: string) => {
    const updatedStrengths = strengths.map(strength => 
      strength.id === id ? { ...strength, [field]: value } : strength
    );
    
    setStrengths(updatedStrengths);
    if (onUpdate) {
      onUpdate(updatedStrengths);
    }
  };

  const handleImageUpdate = (type: 'profile' | 'cover', url: string) => {
    if (type === 'profile') {
      setProfilePicture(url);
    } else {
      setCoverPhoto(url);
    }
  };

  const addStrength = () => {
    if (strengths.length >= 5) return;
    
    const newStrengths = [
      ...strengths, 
      { id: crypto.randomUUID(), title: '', description: '' }
    ];
    
    setStrengths(newStrengths);
    if (onUpdate) {
      onUpdate(newStrengths);
    }
  };

  const removeStrength = (id: string) => {
    if (strengths.length <= 1) return;
    
    const updatedStrengths = strengths.filter(strength => strength.id !== id);
    setStrengths(updatedStrengths);
    
    if (onUpdate) {
      onUpdate(updatedStrengths);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Image Editor */}
      <div className="mb-6">
        <ProfileImageEditor
          profilePicture={profilePicture}
          coverPhoto={coverPhoto}
          onUpdate={handleImageUpdate}
          isOrganization={false}
        />
      </div>

      <p className="text-sm text-muted-foreground">
        Highlight 3-5 key strengths or unique selling points that set your business apart from competitors.
      </p>
      
      {strengths.map((strength, index) => (
        <Card key={strength.id} className="p-0 overflow-hidden">
          <CardHeader className="bg-muted/50 p-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">
                Strength #{index + 1}
              </h4>
              {strengths.length > 1 && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={() => removeStrength(strength.id)}
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`strength-title-${strength.id}`}>Title</Label>
              <Input 
                id={`strength-title-${strength.id}`}
                value={strength.title}
                onChange={(e) => handleStrengthChange(strength.id, 'title', e.target.value)}
                placeholder="e.g., Industry Expertise, Personalized Service, etc."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`strength-description-${strength.id}`}>Description</Label>
              <Textarea 
                id={`strength-description-${strength.id}`}
                rows={3}
                value={strength.description}
                onChange={(e) => handleStrengthChange(strength.id, 'description', e.target.value)}
                placeholder="Describe this strength in 1-2 sentences..."
              />
            </div>
          </CardContent>
        </Card>
      ))}
      
      {strengths.length < 5 && (
        <Button 
          type="button" 
          variant="outline" 
          className="w-full mt-4"
          onClick={addStrength}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Another Strength
        </Button>
      )}
    </div>
  );
}