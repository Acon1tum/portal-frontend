"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Edit, Trash2, Eye, EyeOff, Calendar, Building, User, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { postingService } from "@/service/postingService";
import { useAuth } from "@/lib/auth-context";
import { Posting, PostType } from "@/utils/types";
import Link from "next/link";

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
  const isAdmin = user?.role === 'SUPERADMIN' || user?.role === 'ADMIN';

  // Check if user can edit this post
  const canEditPost = isPostOwner || isAdmin;

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
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/posts">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Posts
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{posting.title}</h1>
            <p className="text-muted-foreground">View post details and manage settings</p>
          </div>
        </div>

        <div className="flex gap-2">
          {canEditPost && (
            <>
              <Link href={`/posts/edit/${posting.id}`}>
                <Button variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </Link>
              <Button
                variant="outline"
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
                onClick={handleDelete}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Post Content */}
          <Card>
            <CardHeader>
              <CardTitle>Post Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p className="whitespace-pre-wrap text-foreground">{posting.content}</p>
              </div>
            </CardContent>
          </Card>

          {/* Attachments */}
          {posting.attachments && posting.attachments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Attachments</CardTitle>
                <CardDescription>
                  Files attached to this post
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {posting.attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center gap-3 p-3 border border-border rounded-lg"
                    >
                      <FileText className="w-5 h-5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{attachment.fileName || 'Unnamed file'}</p>
                        <p className="text-sm text-muted-foreground">
                          {attachment.fileType} • {attachment.size ? `${(attachment.size / 1024).toFixed(1)} KB` : 'Unknown size'}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a 
                          href={attachment.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          download={attachment.fileName}
                        >
                          Download
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Post Info */}
          <Card>
            <CardHeader>
              <CardTitle>Post Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge 
                  variant={posting.isPublished ? "default" : "secondary"}
                >
                  {posting.isPublished ? "Published" : "Draft"}
                </Badge>
                <Badge className={getPostTypeColor(posting.postType)}>
                  {posting.postType.replace('_', ' ')}
                </Badge>
              </div>

              <div className="space-y-3">
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
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full"
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
                  <Button variant="outline" className="w-full">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Post
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  className="w-full text-destructive hover:text-destructive"
                  onClick={handleDelete}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Post
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 