"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Edit, Trash2, Eye, EyeOff, Calendar, Building, User, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { postingService } from "@/service/postingService";
import { useAuth } from "@/lib/auth-context";
import { Posting, PostType } from "@/utils/types";
import Link from "next/link";
import Image from "next/image";

export default function ViewPostPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [posting, setPosting] = useState<Posting | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const postId = params.id as string;

  // Check if current user is the post owner
  const isPostOwner = user && posting && (
    user.id === posting.createdById || 
    user.email === posting.createdBy?.email
  );

  // Check if user is admin (can manage all posts)
  const isAdmin = user?.role === 'SUPERADMIN';

  // Check if user can edit this post
  const canEditPost = isPostOwner || isAdmin;

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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/posts">
            <Button variant="outline" size="sm" className="rounded-lg hover:bg-muted/50">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Posts
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-foreground bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">{posting.title}</h1>
            <p className="text-muted-foreground mt-1">View post details and manage settings</p>
          </div>
        </div>

        <div className="flex gap-3">
          {canEditPost && (
            <>
              <Link href={`/posts/edit/${posting.id}`}>
                <Button variant="outline" className="rounded-lg hover:bg-muted/50">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </Link>
              <Button
                variant="outline"
                className="rounded-lg hover:bg-muted/50"
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
                variant="outline"
                className="rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={handleDelete}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="xl:col-span-3 space-y-8">
          {/* Post Content */}
          <Card className="rounded-xl border border-border/50 shadow-sm hover:shadow-lg transition-shadow duration-200 bg-card/95">
            <div className="h-1 bg-gradient-to-r from-primary/70 via-pink-500/60 to-cyan-500/60 rounded-t-xl" />
            <CardHeader className="pt-6">
              <CardTitle>Post Content</CardTitle>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="prose max-w-none">
                <p className="whitespace-pre-wrap text-foreground leading-relaxed text-lg">{posting.content}</p>
              </div>
            </CardContent>
          </Card>

          {/* Attachments */}
          {posting.attachments && posting.attachments.length > 0 && (
            <Card className="rounded-xl border border-border/50 shadow-sm hover:shadow-lg transition-shadow duration-200 bg-card/95">
              <div className="h-1 bg-gradient-to-r from-blue-500/70 via-purple-500/60 to-indigo-500/60 rounded-t-xl" />
              <CardHeader className="pt-6">
                <CardTitle>Attachments</CardTitle>
                <CardDescription>
                  Files attached to this post
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-6">
                <div className="space-y-6">
                  {posting.attachments.map((attachment) => (
                    <div key={attachment.id}>
                      {attachment.fileType && isImageFile(attachment.fileType) ? (
                        // Image display - Facebook style
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-muted/40 ring-1 ring-border/50">
                              {getViewableImageUrl(attachment) ? (
                                <Image
                                  src={getViewableImageUrl(attachment)}
                                  alt={attachment.fileName || 'Attachment'}
                                  fill
                                  className="object-cover"
                                  sizes="80px"
                                />
                              ) : (
                                <div className="flex items-center justify-center h-full text-muted-foreground">
                                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                  </svg>
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-foreground text-lg">{attachment.fileName || 'Unnamed image'}</p>
                              <p className="text-sm text-muted-foreground mt-1">
                                {attachment.fileType} • {attachment.size ? `${(attachment.size / 1024).toFixed(1)} KB` : 'Unknown size'}
                              </p>
                            </div>
                            <Button variant="outline" size="sm" className="rounded-lg hover:bg-muted/50" asChild>
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
                          {/* Large image preview */}
                          {getViewableImageUrl(attachment) ? (
                            <div className="relative w-full max-w-3xl mx-auto">
                              <Image
                                src={getViewableImageUrl(attachment)}
                                alt={attachment.fileName || 'Attachment'}
                                width={800}
                                height={600}
                                className="w-full h-auto rounded-xl object-contain max-h-[500px] shadow-lg"
                                sizes="(max-width: 768px) 100vw, 800px"
                              />
                            </div>
                          ) : (
                            <div className="flex items-center justify-center p-12 border border-border/50 rounded-xl bg-muted/30">
                              <div className="text-center text-muted-foreground">
                                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                <p className="font-semibold text-lg">Image preview unavailable</p>
                                <p className="text-sm opacity-75 mt-1">Click download to view the image</p>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        // Non-image file display
                        <div className="flex items-center gap-4 p-4 border border-border/60 rounded-xl hover:bg-muted/30 transition-colors">
                          <FileText className="w-5 h-5 text-muted-foreground" />
                          <div className="flex-1">
                            <p className="font-semibold text-foreground text-lg">{attachment.fileName || 'Unnamed file'}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {attachment.fileType} • {attachment.size ? `${(attachment.size / 1024).toFixed(1)} KB` : 'Unknown size'}
                            </p>
                          </div>
                          <Button variant="outline" size="sm" className="rounded-lg hover:bg-muted/50" asChild>
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
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6 xl:col-span-1">
          {/* Post Info */}
          <Card className="rounded-xl border border-border/50 shadow-sm hover:shadow-lg transition-shadow duration-200 bg-card/95">
            <div className="h-1 bg-gradient-to-r from-green-500/70 via-emerald-500/60 to-teal-500/60 rounded-t-xl" />
            <CardHeader className="pt-6">
              <CardTitle>Post Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pb-6">
              <div className="flex items-center gap-2">
                <Badge 
                  variant={posting.isPublished ? "default" : "secondary"}
                  className="rounded-lg"
                >
                  {posting.isPublished ? "Published" : "Draft"}
                </Badge>
                <Badge className={`${getPostTypeColor(posting.postType)} rounded-lg`}>
                  {posting.postType.replace('_', ' ')}
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Created: {formatDate(posting.createdAt)}</span>
                </div>
                
                {posting.updatedAt !== posting.createdAt && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Updated: {formatDate(posting.updatedAt)}</span>
                  </div>
                )}

                {posting.organization && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building className="w-4 h-4" />
                    <span>{posting.organization.name}</span>
                  </div>
                )}

                {posting.createdBy && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span>{posting.createdBy.name || posting.createdBy.email}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          {canEditPost && (
            <Card className="rounded-xl border border-border/50 shadow-sm hover:shadow-lg transition-shadow duration-200 bg-card/95">
              <div className="h-1 bg-gradient-to-r from-orange-500/70 via-red-500/60 to-pink-500/60 rounded-t-xl" />
              <CardHeader className="pt-6">
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pb-6">
                <Button
                  variant="outline"
                  className="w-full rounded-lg hover:bg-muted/50"
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
                
                <Link href={`/posts/edit/${posting.id}`}>
                  <Button variant="outline" className="w-full rounded-lg hover:bg-muted/50">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Post
                  </Button>
                </Link>

                <div className="pt-2">
                  <Button
                    variant="outline"
                    className="w-full rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={handleDelete}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Post
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      </div>
    </div>
  );
} 