'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  Building2, Mail, Phone, Globe, MapPin, Edit, FileText, Users, Star
} from 'lucide-react';

export default function CompanyProfilePage() {
  const company = {
    name: "Nexlify Solutions",
    address: "123 Innovation Drive, Suite 300, Austin, TX 78701",
    email: "contact@nexlify.com",
    phone: "+1 (512) 555-7890",
    website: "www.nexlify.com",
    bio: "Nexlify Solutions is a forward-thinking technology company specializing in AI-driven business solutions. Founded in 2015, we empower organizations to optimize operations and enhance customer experiences through innovative software and consulting services.",
    industry: "Technology & AI",
    founded: "2015",
    companySize: "100-150 employees",
    team: [
        { name: "Sarah Thompson", title: "CEO", image: "/placeholder-1.jpg" },
        { name: "David Lee", title: "CTO", image: "/placeholder-2.jpg" },
        { name: "Emily Chen", title: "Head of Product", image: "/placeholder-3.jpg" },
        { name: "Michael Rodriguez", title: "VP of Engineering", image: "/placeholder-4.jpg" },
        { name: "Jessica Parker", title: "VP of Marketing", image: "/placeholder-5.jpg" },
        { name: "Robert Wilson", title: "Director of Sales", image: "/placeholder-6.jpg" }
    ]
};

return (
    <div className="min-h-screen bg-slate-50 dark:bg-black">
        <div className="">
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Company Profile</h1>
                
                </div>
            </div>
        </div>  

        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-6">
                    <Card className="overflow-hidden border-none shadow-md dark:bg-gray-800 dark:text-gray-100">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 pt-8 pb-6 px-6 text-center">
                            <Avatar className="h-24 w-24 mx-auto ring-4 ring-white dark:ring-gray-700">
                            <AvatarImage src="/company-logo.jpg" alt={company.name} />
                            <AvatarFallback className="bg-blue-100 text-blue-600 text-xl font-semibold dark:bg-gray-600 dark:text-gray-200">
                                {company.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                            </Avatar>
                            <h2 className="mt-4 text-xl font-semibold">{company.name}</h2>
                            <p className="text-gray-500 dark:text-gray-400">{company.industry}</p>
                        </div>
                        
                        <CardContent className="px-6 py-5 space-y-4">
                            <div className="flex items-center">
                            <MapPin className="h-5 w-5 mr-3 text-gray-400 dark:text-gray-500" />
                            <span>{company.address}</span>
                            </div>
                            <div className="flex items-center">
                            <Mail className="h-5 w-5 mr-3 text-gray-400 dark:text-gray-500" />
                            <span>{company.email}</span>
                            </div>
                            <div className="flex items-center">
                            <Phone className="h-5 w-5 mr-3 text-gray-400 dark:text-gray-500" />
                            <span>{company.phone}</span>
                            </div>
                            <div className="flex items-center">
                            <Globe className="h-5 w-5 mr-3 text-gray-400 dark:text-gray-500" />
                            <span>{company.website}</span>
                            </div>
                        </CardContent>
                        
                        <Separator className="dark:bg-gray-700" />
                        
                        <CardFooter className="px-6 py-5">
                            <div className="w-full space-y-3">
                            <div className="flex justify-between text-sm">
                                <span>Year Founded</span>
                                <span className="font-medium">{company.founded}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Company Size</span>
                                <span className="font-medium">{company.companySize}</span>
                            </div>
                            </div>
                        </CardFooter>
                    </Card>
                    
                    <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-3">
                        <Button variant="outline" className="gap-2">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Profile
                        </Button>
                        <Button variant="outline" className="justify-start">
                            <Users className="h-4 w-4 mr-2" />
                            Team
                        </Button>
                        <Button variant="outline" className="justify-start">
                            <FileText className="h-4 w-4 mr-2" />
                            Documents
                        </Button>
                    </CardContent>
                    </Card>
                </div>
                
                <div className="md:col-span-2 space-y-6 ">
                    <Card className="border shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle>Company Bio</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>{company.bio}</p>
                        </CardContent>
                    </Card>
                    
                    {/* Team Members */}
                    <Card className="border shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle>Our Team</CardTitle>
                            <CardDescription>Meet the leadership team driving Nexlify Solutions</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {company.team.map((member, i) => (
                                <div key={i} className="flex items-center border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                                <Avatar className="h-12 w-12 mr-4">
                                    <AvatarImage src={member.image} />
                                    <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{member.name}</p>
                                    <p className="text-sm text-gray-500">{member.title}</p>
                                </div>
                                </div>
                            ))}
                            </div>
                        </CardContent>
                        <CardFooter className="border-t pt-4 flex justify-end">
                            <Link href="/company/profile/team-manager">
                            <Button variant="outline" size="sm">
                                <Edit className="mr-2 h-4 w-4" />
                                Manage Team
                            </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    </div>
    );
}