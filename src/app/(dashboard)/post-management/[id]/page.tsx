"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Edit, Trash2, Eye, EyeOff, Calendar, Building, User, FileText, Image as ImageIcon, Download } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { postingService } from "@/service/postingService";
import { useAuth } from "@/lib/auth-context";
import { Posting, PostType, UserRole } from "@/utils/types";
import Link from "next/link";

export default function AdminViewPostPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [posting, setPosting] = useState<Posting | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const postId = params.id as string;

  useEffect(() => {
    const fetchPosting = async () => {
      try {
        const data = await postingService.getPostingById(postId);
        
        // Check if user has permission to view this post
        if (user?.role !== UserRole.SUPERADMIN) {
          const isOwner = data.createdBy?.id === user?.id || data.createdBy?.email === user?.email;
          if (!isOwner) {
            setError("You don't have permission to view this post");
            setLoading(false);
            return;
          }
        }
        
        setPosting(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch post');
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchPosting();
    }
  }, [postId, user]);

  const handleDelete = async () => {
    if (!posting) return;
    
    if (confirm("Are you sure you want to delete this post?")) {
      try {
        await postingService.deletePosting(posting.id);
        router.push("/post-management");
      } catch (err) {
        console.error("Failed to delete post:", err);
        setError("Failed to delete post");
      }
    }
  };

  const handleTogglePublish = async () => {
    if (!posting) return;
    
    try {
      const updatedPosting = await postingService.togglePublish(posting.id);
      setPosting(updatedPosting);
    } catch (err) {
      console.error("Failed to toggle publish status:", err);
      setError("Failed to update publish status");
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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Helper function to check if file is an image
  const isImageFile = (fileType: string) => {
    return fileType.startsWith('image/');
  };

  // Helper function to get viewable image URL
  const getViewableImageUrl = (attachment: { url: string }) => {
    if (!attachment.url) return '';
    
    const url = attachment.url.trim();
    
    // If it's a data URL, use it directly
    if (url.startsWith('data:')) {
      return url;
    }
    
    // If it's a regular URL, use it
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // For blob URLs or other invalid URLs, return empty
    return '';
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading post...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !posting) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-destructive mb-4">{error || "Post not found"}</p>
            <Link href="/post-management">
              <Button variant="outline">
                Back to Management
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 max-w-4xl">
      {/* Social Media Style Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10 -mx-4 px-4 py-3 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/post-management">
              <Button variant="ghost" size="sm" className="rounded-full hover:bg-muted">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground text-sm font-semibold">
                  {posting.createdBy?.name?.charAt(0) || posting.createdBy?.email?.charAt(0) || 'U'}
                </span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">{posting.title}</h1>
                <p className="text-sm text-muted-foreground">
                  {posting.createdBy?.name || posting.createdBy?.email} • {formatDate(posting.createdAt)}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/post-management/edit/${posting.id}`}>
              <Button variant="ghost" size="sm" className="rounded-full hover:bg-muted">
                <Edit className="w-4 h-4" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full hover:bg-muted"
              onClick={handleTogglePublish}
            >
              {posting.isPublished ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full hover:bg-muted text-destructive hover:text-destructive"
              onClick={handleDelete}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Social Media Style Post */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {/* Post Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-semibold">
                  {posting.createdBy?.name?.charAt(0) || posting.createdBy?.email?.charAt(0) || 'U'}
                </span>
              </div>
              <div>
                <h2 className="font-semibold text-foreground">{posting.createdBy?.name || posting.createdBy?.email}</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{formatDate(posting.createdAt)}</span>
                  <span>•</span>
                  <Badge 
                    variant={posting.isPublished ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {posting.isPublished ? "Published" : "Draft"}
                  </Badge>
                  <Badge className={`${getPostTypeColor(posting.postType)} text-xs`}>
                    {posting.postType.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Post Content */}
        <div className="p-4">
          <div className="prose max-w-none">
            <p className="whitespace-pre-wrap text-foreground leading-relaxed text-base">{posting.content}</p>
          </div>
        </div>

        {/* Attachments */}
        {posting.attachments && posting.attachments.length > 0 && (
          <div className="px-4 pb-4">
            <div className="space-y-3">
              {posting.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="border border-border rounded-xl overflow-hidden"
                >
                  {/* Image Preview */}
                  {attachment.fileType && isImageFile(attachment.fileType) && getViewableImageUrl(attachment) && (
                    <div className="relative w-full bg-muted">
                      <Image
                        src={getViewableImageUrl(attachment)}
                        alt={attachment.fileName || 'Attachment'}
                        width={800}
                        height={600}
                        className="w-full h-auto object-contain max-h-96"
                        onError={() => {
                          // Next.js Image handles errors gracefully
                        }}
                      />
                    </div>
                  )}
                  
                  {/* File Info */}
                  <div className="flex items-center gap-3 p-3 bg-muted/30">
                    {attachment.fileType && isImageFile(attachment.fileType) ? (
                      <ImageIcon className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <FileText className="w-4 h-4 text-muted-foreground" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{attachment.fileName || 'Unnamed file'}</p>
                      <p className="text-xs text-muted-foreground">
                        {attachment.fileType} • {attachment.size ? `${(attachment.size / 1024).toFixed(1)} KB` : 'Unknown size'}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" className="rounded-full hover:bg-muted" asChild>
                      <a 
                        href={attachment.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        download={attachment.fileName}
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Social Media Style Actions */}
        <div className="px-4 py-3 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Button variant="ghost" size="sm" className="rounded-full hover:bg-muted">
                <span className="text-lg">👍</span>
                <span className="ml-2 text-sm text-muted-foreground">Like</span>
              </Button>
              <Button variant="ghost" size="sm" className="rounded-full hover:bg-muted">
                <span className="text-lg">💬</span>
                <span className="ml-2 text-sm text-muted-foreground">Comment</span>
              </Button>
              <Button variant="ghost" size="sm" className="rounded-full hover:bg-muted">
                <span className="text-lg">🔄</span>
                <span className="ml-2 text-sm text-muted-foreground">Share</span>
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="rounded-full hover:bg-muted">
                <span className="text-lg">🔖</span>
              </Button>
              <Button variant="ghost" size="sm" className="rounded-full hover:bg-muted">
                <span className="text-lg">⋯</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Post Details Sidebar */}
      <div className="mt-6 space-y-4">
        {/* Post Stats */}
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="font-semibold text-foreground mb-3">Post Details</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Status</span>
              <Badge 
                variant={posting.isPublished ? "default" : "secondary"}
                className="text-xs"
              >
                {posting.isPublished ? "Published" : "Draft"}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Type</span>
              <Badge className={`${getPostTypeColor(posting.postType)} text-xs`}>
                {posting.postType.replace('_', ' ')}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Created</span>
              <span className="text-foreground">{formatDate(posting.createdAt)}</span>
            </div>
            {posting.updatedAt !== posting.createdAt && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Updated</span>
                <span className="text-foreground">{formatDate(posting.updatedAt)}</span>
              </div>
            )}
            {posting.organization && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Organization</span>
                <span className="text-foreground truncate ml-2">{posting.organization.name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Management Actions */}
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="font-semibold text-foreground mb-3">Manage Post</h3>
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start rounded-lg hover:bg-muted"
              onClick={handleTogglePublish}
            >
              {posting.isPublished ? (
                <>
                  <EyeOff className="w-4 h-4 mr-2" />
                  Unpublish Post
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Publish Post
                </>
              )}
            </Button>
            
            <Link href={`/post-management/edit/${posting.id}`}>
              <Button variant="outline" className="w-full justify-start rounded-lg hover:bg-muted">
                <Edit className="w-4 h-4 mr-2" />
                Edit Post
              </Button>
            </Link>

            <Button
              variant="outline"
              className="w-full justify-start rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleDelete}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Post
            </Button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
} 