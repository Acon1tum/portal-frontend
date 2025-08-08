"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Eye, Heart, MessageCircle, Share2, MoreHorizontal, ThumbsUp, Bookmark, Paperclip, FileText, Download, Image as ImageIcon, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { usePostings } from "@/hooks/usePostings";
import { PostType, PostingComment } from "@/utils/types";
import Link from "next/link";
import Image from "next/image";
import { postingService } from "@/service/postingService";
import { useAuth } from "@/lib/auth-context";

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
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadImage();
  }, [attachment, getViewableImageUrl]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px] text-muted-foreground">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm">Loading image...</p>
        </div>
      </div>
    );
  }

  if (hasError || !imageUrl) {
    return (
      <div className="flex items-center justify-center min-h-[200px] text-muted-foreground">
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

  const isDataOrBlob = imageUrl.startsWith('data:') || imageUrl.startsWith('blob:');

  return (
    <div className="relative w-full" style={{ maxHeight: '600px' }}>
      {isDataOrBlob ? (
        <img
          src={imageUrl}
          alt={attachment.fileName || 'Post image'}
          className="w-full h-auto object-contain rounded-lg max-h-[600px]"
          loading="lazy"
        />
      ) : (
        <Image
          src={imageUrl}
          alt={attachment.fileName || 'Post image'}
          width={800}
          height={600}
          className="w-full h-auto object-contain rounded-lg max-h-[600px]"
          sizes="(max-width: 768px) 100vw, 800px"
          onError={() => setHasError(true)}
        />
      )}
    </div>
  );
}

export default function PostsPage() {
  const { postings, loading, error, fetchPostings } = usePostings();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [expandedAttachmentsByPost, setExpandedAttachmentsByPost] = useState<Record<string, boolean>>({});
  const ATTACHMENTS_PREVIEW_COUNT = 2;
  const [expandedCommentsByPost, setExpandedCommentsByPost] = useState<Record<string, boolean>>({});
  const [commentsByPost, setCommentsByPost] = useState<Record<string, PostingComment[]>>({});
  const [loadingCommentsByPost, setLoadingCommentsByPost] = useState<Record<string, boolean>>({});
  const [errorCommentsByPost, setErrorCommentsByPost] = useState<Record<string, string | undefined>>({});
  const [commentsCountByPost, setCommentsCountByPost] = useState<Record<string, number>>({});
  const [deleteCommentModal, setDeleteCommentModal] = useState<{
    isOpen: boolean;
    commentId: string;
    postingId: string;
    commentContent: string;
  }>({
    isOpen: false,
    commentId: '',
    postingId: '',
    commentContent: '',
  });

  useEffect(() => {
    fetchPostings();
  }, [fetchPostings]);

  // Initialize comments count map from fetched postings
  useEffect(() => {
    const counts: Record<string, number> = {};
    for (const p of postings) {
      counts[p.id] = p._count?.comments ?? (p.comments?.length ?? 0) ?? 0;
    }
    setCommentsCountByPost(counts);
  }, [postings]);

  // Auto-fetch comments for all loaded posts to keep counts accurate and ready to show
  useEffect(() => {
    if (!postings || postings.length === 0) return;
    let isCancelled = false;
    const load = async () => {
      await Promise.all(postings.map(async (p) => {
        if (commentsByPost[p.id]) return;
        try {
          const list = await postingService.getComments(p.id);
          if (isCancelled) return;
          setCommentsByPost(prev => ({ ...prev, [p.id]: list }));
          setCommentsCountByPost(prev => ({ ...prev, [p.id]: list.length }));
        } catch (e) {
          // ignore per-post fetch error here; UI handles on expand
        }
      }));
    };
    load();
    return () => { isCancelled = true; };
  }, [postings]);

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

  const handleToggleComments = async (postId: string) => {
    const isOpen = !!expandedCommentsByPost[postId];
    if (!isOpen && !commentsByPost[postId] && !loadingCommentsByPost[postId]) {
      setLoadingCommentsByPost(prev => ({ ...prev, [postId]: true }));
      setErrorCommentsByPost(prev => ({ ...prev, [postId]: undefined }));
      try {
        const comments = await postingService.getComments(postId);
        setCommentsByPost(prev => ({ ...prev, [postId]: comments }));
        setCommentsCountByPost(prev => ({ ...prev, [postId]: comments.length }));
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Failed to load comments';
        setErrorCommentsByPost(prev => ({ ...prev, [postId]: msg }));
      } finally {
        setLoadingCommentsByPost(prev => ({ ...prev, [postId]: false }));
      }
    }
    setExpandedCommentsByPost(prev => ({ ...prev, [postId]: !isOpen }));
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const diff = Date.now() - date.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
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

  const formatSize = (size?: number) => {
    if (!size || size <= 0) return '';
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
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

  const handleDeleteComment = async () => {
    if (!deleteCommentModal.isOpen) return;
    
    try {
      await postingService.deleteComment(deleteCommentModal.postingId, deleteCommentModal.commentId);
      setCommentsByPost(prev => ({
        ...prev,
        [deleteCommentModal.postingId]: (prev[deleteCommentModal.postingId] || []).filter(x => x.id !== deleteCommentModal.commentId)
      }));
      setCommentsCountByPost(prev => ({
        ...prev,
        [deleteCommentModal.postingId]: Math.max(0, (prev[deleteCommentModal.postingId] ?? 1) - 1),
      }));
      setDeleteCommentModal({ isOpen: false, commentId: '', postingId: '', commentContent: '' });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to delete comment';
      setErrorCommentsByPost(prev => ({ ...prev, [deleteCommentModal.postingId]: msg }));
      setDeleteCommentModal({ isOpen: false, commentId: '', postingId: '', commentContent: '' });
    }
  };

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
            const otherAttachments = (posting.attachments || []).filter(att => !imageAttachment || att.id !== imageAttachment.id);
            const isExpanded = !!expandedAttachmentsByPost[posting.id];
            const attachmentsToRender = otherAttachments.length > 0
              ? (isExpanded ? otherAttachments : otherAttachments.slice(0, ATTACHMENTS_PREVIEW_COUNT))
              : [];
            
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
                    <div className="relative w-full bg-muted rounded-lg overflow-hidden">
                      <ImageWithFallback 
                        attachment={imageAttachment}
                        getViewableImageUrl={getViewableImageUrl}
                      />
                    </div>
                  </div>
                )}

                {/* Attachments List (non-preview) */}
                {posting.attachments && posting.attachments.length > 0 && (
                  <div className="px-6 pb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Paperclip className="w-4 h-4" />
                      <span>Attachments</span>
                    </div>
                    <div className="space-y-2">
                      {otherAttachments.length === 0 ? (
                        // If only an image preview exists and no other files, still show it as an item
                        imageAttachment ? (
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3 min-w-0">
                              <ImageIcon className="w-5 h-5 text-blue-500" />
                              <div className="truncate">
                                <p className="font-medium text-sm truncate">{imageAttachment.fileName || 'Image'}</p>
                                <p className="text-xs text-muted-foreground truncate">
                                  {imageAttachment.fileType} {imageAttachment.size ? `• ${formatSize(imageAttachment.size)}` : ''}
                                </p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                              <a href={imageAttachment.url} target="_blank" rel="noopener noreferrer" download={imageAttachment.fileName}>
                                <Download className="w-4 h-4 mr-2" /> Download
                              </a>
                            </Button>
                          </div>
                        ) : null
                      ) : (
                        <>
                          {attachmentsToRender.map(att => (
                          <div key={att.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3 min-w-0">
                              {att.fileType && isImageFile(att.fileType) ? (
                                <ImageIcon className="w-5 h-5 text-blue-500" />
                              ) : (
                                <FileText className="w-5 h-5 text-gray-500" />
                              )}
                              <div className="truncate">
                                <p className="font-medium text-sm truncate">{att.fileName || 'Attachment'}</p>
                                <p className="text-xs text-muted-foreground truncate">
                                  {att.fileType} {att.size ? `• ${formatSize(att.size)}` : ''}
                                </p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                              <a href={att.url} target="_blank" rel="noopener noreferrer" download={att.fileName}>
                                <Download className="w-4 h-4 mr-2" /> Download
                              </a>
                            </Button>
                          </div>
                          ))}
                          {otherAttachments.length > ATTACHMENTS_PREVIEW_COUNT && (
                            <div className="pt-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-foreground"
                                onClick={() => setExpandedAttachmentsByPost(prev => ({
                                  ...prev,
                                  [posting.id]: !isExpanded,
                                }))}
                              >
                                {isExpanded 
                                  ? 'See less' 
                                  : `See more... (${otherAttachments.length - ATTACHMENTS_PREVIEW_COUNT} more)`}
                              </Button>
                            </div>
                          )}
                        </>
                      )}
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
                      <span>{commentsCountByPost[posting.id] ?? 0} comments</span>
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
                      onClick={() => handleToggleComments(posting.id)}
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
                {!expandedCommentsByPost[posting.id] && (
                  <div className="px-6 pb-4">
                    <Link href={`/posts/view/${posting.id}`}>
                      <Button variant="outline" className="w-full" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View Full Post
                      </Button>
                    </Link>
                  </div>
                )}
                {expandedCommentsByPost[posting.id] && (
                  <div className="px-6 pt-2 pb-4 border-t border-border/50">
                    {loadingCommentsByPost[posting.id] && (
                      <div className="text-sm text-muted-foreground">Loading comments...</div>
                    )}
                    {errorCommentsByPost[posting.id] && (
                      <div className="text-sm text-destructive">{errorCommentsByPost[posting.id]}</div>
                    )}
                    {!loadingCommentsByPost[posting.id] && commentsByPost[posting.id] && (
                      <div className="space-y-3">
                        {commentsByPost[posting.id].length === 0 ? (
                          <div className="text-sm text-muted-foreground">No comments yet.</div>
                        ) : (
                          commentsByPost[posting.id].map((c) => (
                            <div key={c.id} className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                                {(c.user?.name || c.user?.email || 'U').charAt(0)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 text-sm">
                                  <span className="font-medium text-foreground truncate max-w-[200px]">{c.user?.name || c.user?.email || 'User'}</span>
                                  <span className="text-muted-foreground">• {formatTimeAgo(c.createdAt)}</span>
                                  {/* Comment actions */}
                                  {(user && (user.id === c.userId || user.id === posting.createdBy?.id)) && (
                                    <div className="ml-auto relative">
                                      <button
                                        type="button"
                                        className="p-1 rounded hover:bg-muted"
                                        onClick={() => setDeleteCommentModal({
                                          isOpen: true,
                                          commentId: c.id,
                                          postingId: posting.id,
                                          commentContent: c.content,
                                        })}
                                        title="More"
                                      >
                                        <MoreHorizontal className="w-4 h-4" />
                                      </button>
                                    </div>
                                  )}
                                </div>
                                <div className="text-sm text-foreground/90 whitespace-pre-wrap">
                                  {c.content}
                                </div>
                                <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                                  <button className="hover:underline" type="button">Like</button>
                                  <button className="hover:underline" type="button">Reply</button>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                        {user ? (
                        <form
                          className="mt-3 flex items-center gap-2"
                          onSubmit={async (e) => {
                            e.preventDefault();
                            const form = e.currentTarget as HTMLFormElement;
                            const input = form.elements.namedItem('newComment') as HTMLInputElement;
                            const content = input.value.trim();
                            if (!content) return;
                            try {
                              const created = await postingService.createComment(posting.id, content);
                              setCommentsByPost(prev => ({
                                ...prev,
                                [posting.id]: [...(prev[posting.id] || []), created],
                              }));
                              setCommentsCountByPost(prev => ({
                                ...prev,
                                [posting.id]: (prev[posting.id] ?? 0) + 1,
                              }));
                              input.value = '';
                            } catch (err) {
                              const msg = err instanceof Error ? err.message : 'Failed to add comment';
                              setErrorCommentsByPost(prev => ({ ...prev, [posting.id]: msg }));
                            }
                          }}
                        >
                          <input
                            type="text"
                            name="newComment"
                            placeholder="Write a comment..."
                            className="flex-1 px-3 py-2 border rounded-md bg-background text-sm"
                          />
                          <Button type="submit" size="sm">
                            <Send className="w-4 h-4" />
                          </Button>
                        </form>
                        ) : (
                          <div className="mt-3 text-sm text-muted-foreground">
                            <Link href="/login" className="underline">Log in</Link> to comment.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
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

      {/* Delete Comment Modal */}
      <Dialog open={deleteCommentModal.isOpen} onOpenChange={(open) => {
        if (!open) {
          setDeleteCommentModal({ isOpen: false, commentId: '', postingId: '', commentContent: '' });
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Comment</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this comment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-sm text-muted-foreground">Comment:</p>
              <p className="text-sm mt-1">{deleteCommentModal.commentContent}</p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteCommentModal({ isOpen: false, commentId: '', postingId: '', commentContent: '' })}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteComment}
            >
              Delete Comment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 