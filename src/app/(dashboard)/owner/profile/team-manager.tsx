'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, Plus, Trash2, Save, Link as LinkIcon } from 'lucide-react';

type TeamMember = {
  id: string;
  name: string;
  title: string;
  bio: string;
  imageUrl?: string;
  linkedin?: string;
  twitter?: string;
};

interface TeamManagerProps {
  initialMembers?: TeamMember[];
  onSave?: (members: TeamMember[]) => void;
  standalone?: boolean;
}

export default function TeamManager({ 
  initialMembers = [], 
  onSave,
  standalone = false 
}: TeamManagerProps) {
  const [members, setMembers] = useState<TeamMember[]>(
    initialMembers.length > 0 
      ? initialMembers 
      : [{ id: crypto.randomUUID(), name: '', title: '', bio: '' }]
  );

  const handleMemberChange = (id: string, field: keyof TeamMember, value: string) => {
    setMembers(prev => 
      prev.map(member => 
        member.id === id ? { ...member, [field]: value } : member
      )
    );
  };

  const addMember = () => {
    setMembers(prev => [
      ...prev, 
      { 
        id: crypto.randomUUID(), 
        name: '', 
        title: '', 
        bio: '' 
      }
    ]);
  };

  const removeMember = (id: string) => {
    setMembers(prev => prev.filter(member => member.id !== id));
  };

  const handleSave = () => {
    if (onSave) {
      onSave(members);
    }
  };

  return (
    <div className="space-y-6">
      {standalone && (
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Team Members</h1>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className={standalone ? "text-xl font-semibold" : "text-2xl font-bold"}>
            {standalone ? "Manage Team Members" : "Team Members"}
          </h2>
        </div>
        
        <p className="text-sm text-muted-foreground">
          Add key team members to showcase the expertise and talent in your company.
        </p>
        
        {members.map((member) => (
          <Card key={member.id} className="p-0 overflow-hidden">
            <CardHeader className="bg-muted/50 p-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">
                  {member.name || `New Team Member`}
                </h4>
                {members.length > 1 && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    onClick={() => removeMember(member.id)}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/4 flex flex-col items-center space-y-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={member.imageUrl || ""} alt="Team Member" />
                    <AvatarFallback>
                      {member.name ? member.name.split(' ').map(n => n[0]).join('') : 'TM'}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" className="w-full">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Photo
                  </Button>
                </div>
                
                <div className="md:w-3/4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`member-name-${member.id}`}>Full Name</Label>
                      <Input 
                        id={`member-name-${member.id}`}
                        value={member.name}
                        onChange={(e) => handleMemberChange(member.id, 'name', e.target.value)}
                        placeholder="e.g., John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`member-title-${member.id}`}>Job Title</Label>
                      <Input 
                        id={`member-title-${member.id}`}
                        value={member.title}
                        onChange={(e) => handleMemberChange(member.id, 'title', e.target.value)}
                        placeholder="e.g., CEO & Founder"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`member-bio-${member.id}`}>Bio</Label>
                    <Textarea 
                      id={`member-bio-${member.id}`}
                      rows={3}
                      value={member.bio}
                      onChange={(e) => handleMemberChange(member.id, 'bio', e.target.value)}
                      placeholder="A brief professional bio highlighting expertise and experience..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`member-linkedin-${member.id}`}>LinkedIn Profile</Label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                          <LinkIcon className="h-4 w-4" />
                        </span>
                        <Input
                          id={`member-linkedin-${member.id}`}
                          value={member.linkedin || ''}
                          onChange={(e) => handleMemberChange(member.id, 'linkedin', e.target.value)}
                          placeholder="e.g., linkedin.com/in/johndoe"
                          className="rounded-l-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`member-twitter-${member.id}`}>Twitter/X Profile</Label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                          @
                        </span>
                        <Input
                          id={`member-twitter-${member.id}`}
                          value={member.twitter || ''}
                          onChange={(e) => handleMemberChange(member.id, 'twitter', e.target.value)}
                          placeholder="e.g., johndoe"
                          className="rounded-l-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        <Button 
          type="button" 
          variant="outline" 
          className="w-full mt-4"
          onClick={addMember}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Another Team Member
        </Button>
      </div>
      
      {!standalone && (
        <div className="flex justify-end mt-6">
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
}