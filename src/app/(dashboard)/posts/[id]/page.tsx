"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Edit, Trash2, Eye, EyeOff, Calendar, Building, User, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { postingService } from "@/service/postingService";
import { useAuth } from "@/lib/auth-context";
import { Posting, PostType, UserRole, PermissionName } from "@/utils/types";
import Link from "next/link";
import Image from "next/image";
import { CommentSection } from "@/components/custom-ui/comments/CommentSection";

export default function ViewPostPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [posting, setPosting] = useState<Posting | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const postId = params.id as string;

  const hasPermission = (permission: PermissionName) => {
    // In a real app, this would check against user's roles and permissions from the backend
    if (user?.role === UserRole.CORPORATE_PROFESSIONAL) {
      return [
        PermissionName.POST_EDIT,
        PermissionName.POST_DELETE,
      ].includes(permission);
    }
    return false;
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

  useEffect(() => {
    const fetchPosting = async () => {
      try {
        const data = await postingService.getPostingById(postId);
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
  }, [postId]);

  const handleDelete = async () => {
    if (!posting) return;
    
    if (confirm("Are you sure you want to delete this post?")) {
      try {
        await postingService.deletePosting(posting.id);
        router.push("/posts");
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
      case PostType.JOB_LISTING:
        return "bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-400 border border-blue-500/30";
      case PostType.ANNOUNCEMENT:
        return "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border border-yellow-500/30";
      case PostType.NEWS:
        return "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/30";
      case PostType.EVENT:
        return "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border border-purple-500/30";
      case PostType.PROMOTION:
        return "bg-gradient-to-r from-pink-500/20 to-rose-500/20 text-pink-400 border border-pink-500/30";
      case PostType.GENERAL:
        return "bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-400 border border-gray-500/30";
      default:
        return "bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-400 border border-gray-500/30";
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
            <Link href="/posts">
              <Button variant="outline">
                Back to Posts
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/posts">
            <Button variant="ghost" size="sm" className="rounded-xl hover:bg-muted/50 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Posts
            </Button>
          </Link>

          <div className="flex gap-2">
            {hasPermission(PermissionName.POST_EDIT) && (
              <>
                <Link href={`/posts/edit/${posting.id}`}>
                  <Button variant="ghost" size="sm" className="rounded-xl hover:bg-muted/50 transition-colors">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-xl hover:bg-muted/50 transition-colors"
                  onClick={handleTogglePublish}
                >
                  {posting.isPublished ? (
                    <>
                      <EyeOff className="w-4 h-4 mr-2" />
                      Unpublish
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 mr-2" />
                      Publish
                    </>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors"
                  onClick={handleDelete}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Main Post - Social Media Style */}
        <Card className="rounded-xl border-0 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 bg-card/95 backdrop-blur-sm">
          {/* Post Header */}
          <CardHeader className="p-6 pb-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center text-primary font-semibold text-lg">
                {posting.createdBy?.name?.charAt(0) || posting.organization?.name?.charAt(0) || "U"}
              </div>
              <div className="flex flex-col w-full gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-foreground text-base">
                      {posting.createdBy?.name || posting.organization?.name || "Unknown User"}
                    </h3>
                    {posting.organization && (
                      <Badge variant="secondary" className="text-xs px-2 py-1 bg-muted/50 rounded-full">
                        {posting.organization.name}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="hover:text-foreground transition-colors cursor-pointer">
                    {formatDate(posting.createdAt)}
                  </span>
                  <span>•</span>
                  <Badge className={`text-xs px-3 py-1 font-medium rounded-full ${getPostTypeColor(posting.postType)}`}>
                    {posting.postType.replace("_", " ")}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>

          {/* Post Title */}
          <div className="px-6 pb-4">
            <h1 className="text-2xl font-bold text-foreground leading-tight mb-4">
              {posting.title}
            </h1>
          </div>

          {/* Post Content */}
          <CardContent className="px-6 pt-0 pb-6">
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap text-foreground leading-relaxed text-base">{posting.content}</p>
            </div>
          </CardContent>

          {/* Attachments */}
          {posting.attachments && posting.attachments.length > 0 && (
            <div className="px-6 pb-6">
              <div className="space-y-4">
                {posting.attachments.map((attachment) => (
                  <div key={attachment.id}>
                    {attachment.fileType && isImageFile(attachment.fileType) ? (
                      // Image display - Social media style
                      <div className="space-y-3">
                        {/* Large image preview */}
                        {getViewableImageUrl(attachment) ? (
                          <div className="relative w-full">
                            <Image
                              src={getViewableImageUrl(attachment)}
                              alt={attachment.fileName || 'Attachment'}
                              width={800}
                              height={600}
                              className="w-full h-auto rounded-xl object-contain max-h-[600px] shadow-sm"
                              sizes="(max-width: 768px) 100vw, 800px"
                            />
                          </div>
                        ) : (
                          <div className="flex items-center justify-center p-12 border border-border/30 rounded-xl bg-muted/20">
                            <div className="text-center text-muted-foreground">
                              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                              </svg>
                              <p className="font-semibold text-lg">Image preview unavailable</p>
                              <p className="text-sm opacity-75 mt-1">Click download to view the image</p>
                            </div>
                          </div>
                        )}
                        {/* Image info */}
                        <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-muted/40 flex items-center justify-center">
                              <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium text-foreground text-sm">{attachment.fileName || 'Unnamed image'}</p>
                              <p className="text-xs text-muted-foreground">
                                {attachment.fileType} • {attachment.size ? `${(attachment.size / 1024).toFixed(1)} KB` : 'Unknown size'}
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="rounded-lg hover:bg-muted/50" asChild>
                            <a 
                              href={attachment.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              download={attachment.fileName}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </a>
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // Non-image file display
                      <div className="flex items-center gap-4 p-4 border border-border/30 rounded-xl hover:bg-muted/20 transition-colors">
                        <div className="w-10 h-10 rounded-lg bg-muted/40 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{attachment.fileName || 'Unnamed file'}</p>
                          <p className="text-sm text-muted-foreground">
                            {attachment.fileType} • {attachment.size ? `${(attachment.size / 1024).toFixed(1)} KB` : 'Unknown size'}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm" className="rounded-lg hover:bg-muted/50" asChild>
                          <a 
                            href={attachment.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            download={attachment.fileName}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </a>
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Engagement Stats */}
          <div className="px-6 py-4 border-t border-border/30">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 hover:text-foreground transition-colors cursor-pointer">
                  <div className="w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white fill-white" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </div>
                  <span className="font-medium">42</span>
                </div>
                <div className="flex items-center gap-2 hover:text-foreground transition-colors cursor-pointer">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                  </svg>
                  <span className="font-medium">1</span>
                </div>
                <div className="flex items-center gap-2 hover:text-foreground transition-colors cursor-pointer">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
                  </svg>
                  <span className="font-medium">3</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>2.1k views</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-6 py-4 border-t border-border/30">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 flex items-center justify-center gap-2 py-3 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
                <span className="font-medium">Like</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 flex items-center justify-center gap-2 py-3 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 rounded-xl transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
                <span className="font-medium">Comment</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 flex items-center justify-center gap-2 py-3 text-muted-foreground hover:text-green-500 hover:bg-green-500/10 rounded-xl transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
                </svg>
                <span className="font-medium">Share</span>
              </Button>
            </div>
          </div>
        </Card>

        {/* Comments Section */}
        <div className="mt-6">
          <CommentSection />
        </div>

      </div>
    </div>
  );
} 