"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Eye, Heart, MessageCircle, Share2, MoreHorizontal, ThumbsUp, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePostings } from "@/hooks/usePostings";
import { PostType } from "@/utils/types";
import Link from "next/link";
import Image from "next/image";

// ImageWithFallback component
interface ImageWithFallbackProps {
  attachment: { id: string; url?: string; fileName?: string };
  getViewableImageUrl: (attachment: { id: string; url?: string }) => Promise<string>;
}

function ImageWithFallback({ attachment, getViewableImageUrl }: ImageWithFallbackProps) {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const loadImage = async () => {
      setIsLoading(true);
      setHasError(false);
      
      try {
        const url = await getViewableImageUrl(attachment);
        if (url) {
          setImageUrl(url);
        } else {
          setHasError(true);
        }
      } catch (error) {
        console.error('Failed to load image:', error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadImage();
  }, [attachment, getViewableImageUrl]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm">Loading image...</p>
        </div>
      </div>
    );
  }

  if (hasError || !imageUrl) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <div className="text-center">
          <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <p className="text-sm font-medium">{attachment.fileName || 'Attachment'}</p>
          <p className="text-xs opacity-75">Click &quot;View Full Post&quot; to download</p>
        </div>
      </div>
    );
  }

  return (
    <Image
      src={imageUrl}
      alt={attachment.fileName || 'Post image'}
      fill
      className="object-cover"
      sizes="(max-width: 768px) 100vw, 600px"
      onError={() => setHasError(true)}
    />
  );
}

export default function PostsPage() {
  const { postings, loading, error, fetchPostings } = usePostings();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");

  useEffect(() => {
    fetchPostings();
  }, [fetchPostings]);

  // Only show published posts for viewing
  const publishedPostings = postings.filter(posting => posting.isPublished);

  const filteredPostings = publishedPostings.filter(posting => {
    const matchesSearch = posting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         posting.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || posting.postType === selectedType;
    
    return matchesSearch && matchesType;
  });

  const getPostTypeColor = (type: PostType) => {
    switch (type) {
      case PostType.JOB_LISTING: return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
      case PostType.ANNOUNCEMENT: return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
      case PostType.NEWS: return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      case PostType.EVENT: return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300";
      case PostType.PROMOTION: return "bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-300";
      case PostType.GENERAL: return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      });
    }
  };

  const isImageFile = (fileType: string) => {
    return fileType.startsWith('image/');
  };

  // Function to get viewable image URL
  const getViewableImageUrl = async (attachment: { id: string; url?: string }) => {
    if (!attachment || !attachment.url) return '';

    const url = attachment.url.trim();
    
    // If it's already a data URL, use it directly
    if (url.startsWith('data:')) {
      return url;
    }
    
    // If it's a regular URL, use it
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // If it's a blob URL, we can't use it (it's already been revoked or is invalid)
    if (url.startsWith('blob:')) {
      return '';
    }
    
    return '';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background w-full">
        <div className="w-full px-4 py-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading posts...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background w-full">
        <div className="w-full px-4 py-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={fetchPostings} variant="outline">
                Retry
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background w-full">
      <div className="w-full px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Posts</h1>
          <p className="text-muted-foreground">Browse and read published posts and announcements</p>
        </div>

        {/* Filters */}
        <Card className="mb-6 border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
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

              <Button variant="outline" onClick={fetchPostings}>
                <Filter className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Posts Feed - Single Column */}
        <div className="space-y-6 max-w-2xl mx-auto">
          {filteredPostings.map((posting) => {
            // Get first image attachment for preview
            const imageAttachment = posting.attachments?.find(att => att.fileType && isImageFile(att.fileType));
            
            return (
              <Card key={posting.id} className="border-0 shadow-sm">
                {/* Post Header */}
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src="/avatars/default.jpg" alt="User" />
                      <AvatarFallback>
                        {posting.createdBy?.name?.charAt(0) || posting.organization?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground truncate">
                          {posting.createdBy?.name || posting.organization?.name || "Unknown User"}
                        </h3>
                        {posting.organization && (
                          <Badge variant="secondary" className="text-xs">
                            {posting.organization.name}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{formatDate(posting.createdAt)}</span>
                        <span>•</span>
                        <Badge className={`text-xs ${getPostTypeColor(posting.postType)}`}>
                          {posting.postType.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="p-2">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>

                {/* Post Content */}
                <CardContent className="pt-0 pb-4">
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-foreground leading-tight">
                      {posting.title}
                    </h2>
                    <div className="text-muted-foreground leading-relaxed">
                      {posting.content && posting.content.length > 200 
                        ? `${posting.content.substring(0, 200)}...` 
                        : posting.content
                      }
                    </div>
                  </div>
                </CardContent>

                {/* Image Preview */}
                {imageAttachment && (
                  <div className="px-6 pb-4">
                    <div className="relative w-full h-64 bg-muted rounded-lg overflow-hidden">
                      <ImageWithFallback 
                        attachment={imageAttachment}
                        getViewableImageUrl={getViewableImageUrl}
                      />
                    </div>
                  </div>
                )}

                {/* Engagement Stats */}
                <div className="px-6 py-3 border-t border-border">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <ThumbsUp className="w-3 h-3 text-primary-foreground" />
                      </div>
                      <span>42 likes</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span>8 comments</span>
                      <span>3 shares</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="px-6 py-2 border-t border-border">
                  <div className="flex items-center justify-between">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="flex-1 flex items-center justify-center gap-2 py-2 text-muted-foreground hover:text-foreground"
                    >
                      <Heart className="w-5 h-5" />
                      <span className="font-medium">Like</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="flex-1 flex items-center justify-center gap-2 py-2 text-muted-foreground hover:text-foreground"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span className="font-medium">Comment</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="flex-1 flex items-center justify-center gap-2 py-2 text-muted-foreground hover:text-foreground"
                    >
                      <Share2 className="w-5 h-5" />
                      <span className="font-medium">Share</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="p-2 text-muted-foreground hover:text-foreground"
                    >
                      <Bookmark className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* View Post Button */}
                <div className="px-6 pb-4">
                  <Link href={`/posts/view/${posting.id}`}>
                    <Button variant="outline" className="w-full" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      View Full Post
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>

        {filteredPostings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No published posts found</p>
          </div>
        )}
      </div>
    </div>
  );
} 