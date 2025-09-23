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
import { PostType, UserRole, PermissionName } from "@/utils/types";
import Link from "next/link";

export default function PostManagementPage() {
  const { postings, loading, error, fetchMyPostings, deletePosting, togglePublish } = usePostings();
  const { user, loading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  useEffect(() => {
    // Only fetch posts if user is authenticated
    if (user && !authLoading) {
      fetchMyPostings();
    }
  }, [fetchMyPostings, user, authLoading]);

  const hasPermission = (permission: PermissionName) => {
    // In a real app, this would check against user's roles and permissions from the backend
    if (user?.role === UserRole.CORPORATE_PROFESSIONAL) {
      return [
        PermissionName.POST_CREATE,
        PermissionName.POST_EDIT,
        PermissionName.POST_DELETE,
        PermissionName.POST_VIEW,
      ].includes(permission);
    }
    return permission === PermissionName.POST_VIEW;
  };

  // Filter posts based on user role
  const getFilteredPostings = () => {
    if (hasPermission(PermissionName.POST_VIEW)) {
      return postings;
    }
    return [];
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



  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Checking authentication...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show message if user is not authenticated
  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Authentication Required</h2>
            <p className="text-muted-foreground mb-6">
              You need to be logged in to view your posts.
            </p>
            <Link href="/auth">
              <Button className="rounded-lg hover:bg-primary/90">
                Go to Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
            <Button onClick={fetchMyPostings} variant="outline">
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">My Posts</h1>
          <p className="text-muted-foreground mt-2">
            Manage your posts and announcements
          </p>
          {filteredPostings.length > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              {filteredPostings.length} post{filteredPostings.length !== 1 ? 's' : ''} found
            </p>
          )}
        </div>
        {hasPermission(PermissionName.POST_CREATE) && (
          <Link href="/post-management/create">
            <Button className="rounded-lg hover:bg-primary/90 px-6">
              <Plus className="w-4 h-4 mr-2" />
              Create Post
            </Button>
          </Link>
        )}
      </div>

      {/* Filters */}
      <Card className="mb-8 rounded-xl border border-border/50 shadow-sm hover:shadow-lg transition-shadow duration-200 bg-card/95">
        <div className="h-1 bg-gradient-to-r from-blue-500/70 via-purple-500/60 to-indigo-500/60 rounded-t-xl" />
        <CardContent className="pt-6 pb-6">
          <div className="space-y-4">
            {/* Filter Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Filters</h3>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={fetchMyPostings} 
                className="rounded-lg hover:bg-muted/50"
              >
                <Filter className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>

            {/* Filter Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Search Posts</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by title or content..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 rounded-lg border-border/60 focus:border-primary"
                  />
                </div>
              </div>
              
              {/* Post Type Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Post Type</label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="rounded-lg border-border/60 focus:border-primary">
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
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Status</label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="rounded-lg border-border/60 focus:border-primary">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters Display */}
            {(searchTerm || selectedType !== "all" || selectedStatus !== "all") && (
              <div className="flex items-center gap-2 pt-2 border-t border-border/30">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                <div className="flex flex-wrap gap-2">
                  {searchTerm && (
                    <Badge variant="secondary" className="text-xs">
                      Search: "{searchTerm}"
                    </Badge>
                  )}
                  {selectedType !== "all" && (
                    <Badge variant="secondary" className="text-xs">
                      Type: {selectedType.replace('_', ' ')}
                    </Badge>
                  )}
                  {selectedStatus !== "all" && (
                    <Badge variant="secondary" className="text-xs">
                      Status: {selectedStatus}
                    </Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedType("all");
                    setSelectedStatus("all");
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear all
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPostings.map((posting) => (
          <Card key={posting.id} className="rounded-xl border border-border/50 shadow-sm hover:shadow-xl transition-all duration-200 bg-card/95 hover:scale-[1.02]">
            <div className="h-1 bg-gradient-to-r from-primary/70 via-pink-500/60 to-cyan-500/60 rounded-t-xl" />
            <CardHeader className="pt-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2 font-semibold">{posting.title}</CardTitle>
                  <CardDescription className="mt-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {formatDate(posting.createdAt)}
                    </div>
                  </CardDescription>
                </div>
                <Badge 
                  variant={posting.isPublished ? "default" : "secondary"}
                  className="ml-2 rounded-lg"
                >
                  {posting.isPublished ? "Published" : "Draft"}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="pb-6">
              <p className="text-sm text-muted-foreground line-clamp-3 mb-4 leading-relaxed">
                {posting.content}
              </p>

              <div className="flex items-center gap-2 mb-4">
                <Badge className={`${getPostTypeColor(posting.postType)} text-xs`}>
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
                      <div key={attachment.id} className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded">
                        {attachment.fileType && isImageFile(attachment.fileType) ? (
                          <ImageIcon className="w-3 h-3" />
                        ) : (
                          <Paperclip className="w-3 h-3" />
                        )}
                        <span className="truncate max-w-24">
                          {attachment.fileName || 'Unnamed file'}
                        </span>
                      </div>
                    ))}
                    {posting.attachments.length > 3 && (
                      <span className="text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded">
                        +{posting.attachments.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Author and Organization Info */}
              <div className="space-y-2 mb-6">
                {posting.organization && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{posting.organization.name}</span>
                  </div>
                )}
                {posting.createdBy && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{posting.createdBy.name || posting.createdBy.email}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-border/50">
                <div className="flex gap-1">
                  <Link href={`/post-management/${posting.id}`}>
                    <Button variant="outline" size="sm" title="View Details" className="rounded-lg hover:bg-muted/50">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Link>
                  {posting.isPublished && (
                    <Link href={`/posts/view/${posting.id}`}>
                      <Button variant="outline" size="sm" title="View Public Post" className="rounded-lg hover:bg-muted/50">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </Link>
                  )}
                  {hasPermission(PermissionName.POST_EDIT) && (
                    <Link href={`/post-management/edit/${posting.id}`}>
                      <Button variant="outline" size="sm" title="Edit Post" className="rounded-lg hover:bg-muted/50">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                  )}
                </div>
                
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    title={posting.isPublished ? "Unpublish Post" : "Publish Post"}
                    className="rounded-lg hover:bg-muted/50"
                    onClick={() => handleTogglePublish(posting.id)}
                  >
                    {posting.isPublished ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                  {hasPermission(PermissionName.POST_DELETE) && (
                    <Button
                      variant="outline"
                      size="sm"
                      title="Delete Post"
                      className="rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(posting.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPostings.length === 0 && (
        <div className="text-center py-20">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-muted/50 flex items-center justify-center">
              <Plus className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">
              {searchTerm || selectedType !== "all" || selectedStatus !== "all" 
                ? "No posts match your filters" 
                : "No posts yet"}
            </h3>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              {searchTerm || selectedType !== "all" || selectedStatus !== "all"
                ? "Try adjusting your search terms or filters to find what you're looking for."
                : "Start sharing your thoughts, announcements, or job listings with the community."}
            </p>
            {hasPermission(PermissionName.POST_CREATE) && (
              <Link href="/post-management/create">
                <Button className="rounded-lg hover:bg-primary/90 px-6">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Post
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
      </div>
    </div>
  );
} 