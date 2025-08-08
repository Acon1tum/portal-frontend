"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Filter, Eye, Edit, Trash2, EyeOff, Calendar, Building, User, ExternalLink, Paperclip, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePostings } from "@/hooks/usePostings";
import { useAuth } from "@/lib/auth-context";
import { PostType, UserRole } from "@/utils/types";
import Link from "next/link";

export default function PostManagementPage() {
  const { postings, loading, error, fetchPostings, deletePosting, togglePublish } = usePostings();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  useEffect(() => {
    fetchPostings();
  }, [fetchPostings]);

  // Filter posts based on user role
  const getFilteredPostings = () => {
    let filtered = postings;

    // If user is not superadmin, only show their own posts
    if (user?.role !== UserRole.SUPERADMIN) {
      filtered = postings.filter(posting => 
        posting.createdBy?.id === user?.id || 
        posting.createdBy?.email === user?.email
      );
    }

    return filtered;
  };

  const filteredPostings = getFilteredPostings().filter(posting => {
    const matchesSearch = posting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         posting.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || posting.postType === selectedType;
    const matchesStatus = selectedStatus === "all" || 
                         (selectedStatus === "published" && posting.isPublished) ||
                         (selectedStatus === "draft" && !posting.isPublished);
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePosting(id);
      } catch (err) {
        console.error("Failed to delete post:", err);
      }
    }
  };

  const handleTogglePublish = async (id: string) => {
    try {
      await togglePublish(id);
    } catch (err) {
      console.error("Failed to toggle publish status:", err);
    }
  };

  const getPostTypeColor = (type: PostType) => {
    switch (type) {
      case PostType.JOB_LISTING: return "bg-blue-100 text-blue-800";
      case PostType.ANNOUNCEMENT: return "bg-yellow-100 text-yellow-800";
      case PostType.NEWS: return "bg-green-100 text-green-800";
      case PostType.EVENT: return "bg-purple-100 text-purple-800";
      case PostType.PROMOTION: return "bg-pink-100 text-pink-800";
      case PostType.GENERAL: return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Helper function to check if file is an image
  const isImageFile = (fileType: string) => {
    return fileType.startsWith('image/');
  };



  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading posts...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={fetchPostings} variant="outline">
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Post Management</h1>
          <p className="text-muted-foreground">
            {user?.role === UserRole.SUPERADMIN 
              ? "Manage your organization's posts and announcements" 
              : "Manage your posts and announcements"
            }
          </p>
        </div>
        <Link href="/post-management/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Post
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value={PostType.JOB_LISTING}>Job Listing</SelectItem>
                <SelectItem value={PostType.ANNOUNCEMENT}>Announcement</SelectItem>
                <SelectItem value={PostType.NEWS}>News</SelectItem>
                <SelectItem value={PostType.EVENT}>Event</SelectItem>
                <SelectItem value={PostType.PROMOTION}>Promotion</SelectItem>
                <SelectItem value={PostType.GENERAL}>General</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={fetchPostings}>
              <Filter className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPostings.map((posting) => (
          <Card key={posting.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2">{posting.title}</CardTitle>
                  <CardDescription className="mt-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {formatDate(posting.createdAt)}
                    </div>
                  </CardDescription>
                </div>
                <Badge 
                  variant={posting.isPublished ? "default" : "secondary"}
                  className="ml-2"
                >
                  {posting.isPublished ? "Published" : "Draft"}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                {posting.content}
              </p>

              <div className="flex items-center gap-2 mb-4">
                <Badge className={getPostTypeColor(posting.postType)}>
                  {posting.postType.replace('_', ' ')}
                </Badge>
              </div>

              {/* Attachments Preview */}
              {posting.attachments && posting.attachments.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Paperclip className="w-4 h-4" />
                    <span>{posting.attachments.length} attachment{posting.attachments.length !== 1 ? 's' : ''}</span>
                  </div>
                  
                  {/* Show first few attachments */}
                  <div className="flex flex-wrap gap-2">
                                         {posting.attachments.slice(0, 3).map((attachment) => (
                       <div key={attachment.id} className="flex items-center gap-1 text-xs text-muted-foreground">
                         {attachment.fileType && isImageFile(attachment.fileType) ? (
                           <ImageIcon className="w-3 h-3" />
                         ) : (
                           <Paperclip className="w-3 h-3" />
                         )}
                         <span className="truncate max-w-20">
                           {attachment.fileName || 'Unnamed file'}
                         </span>
                       </div>
                     ))}
                    {posting.attachments.length > 3 && (
                      <span className="text-xs text-muted-foreground">
                        +{posting.attachments.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                {posting.organization && (
                  <div className="flex items-center gap-1">
                    <Building className="w-4 h-4" />
                    <span>{posting.organization.name}</span>
                  </div>
                )}
                {posting.createdBy && (
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{posting.createdBy.name || posting.createdBy.email}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Link href={`/post-management/${posting.id}`}>
                    <Button variant="outline" size="sm" title="Admin View">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Link>
                  {posting.isPublished && (
                    <Link href={`/posts/view/${posting.id}`}>
                      <Button variant="outline" size="sm" title="Public View">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </Link>
                  )}
                  <Link href={`/post-management/edit/${posting.id}`}>
                    <Button variant="outline" size="sm" title="Edit">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTogglePublish(posting.id)}
                  >
                    {posting.isPublished ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(posting.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPostings.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            {user?.role === UserRole.SUPERADMIN 
              ? "No posts found" 
              : "No posts found. Create your first post to get started."
            }
          </p>
          <Link href="/post-management/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              {user?.role === UserRole.SUPERADMIN 
                ? "Create Your First Post" 
                : "Create Post"
              }
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
} 