"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Calendar, 
  Building, 
  User, 
  FileText, 
  ExternalLink,
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Send,
  ThumbsUp,
  Bookmark,
  Image as ImageIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { postingService } from "@/service/postingService";
import { Posting, PostType } from "@/utils/types";
import Link from "next/link";
import Image from "next/image";

export default function PublicViewPostPage() {
  const params = useParams();
  const router = useRouter();
  const [posting, setPosting] = useState<Posting | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState("");
  const [showComments, setShowComments] = useState(false);

  const postId = params.id as string;

  useEffect(() => {
    const fetchPosting = async () => {
      try {
        const data = await postingService.getPostingById(postId);
        // Only show published posts in public view
        if (!data.isPublished) {
          setError("This post is not available for public viewing");
          return;
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
  }, [postId]);

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

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleComment = () => {
    if (comment.trim()) {
      // Here you would typically send the comment to the backend
      console.log("Comment:", comment);
      setComment("");
    }
  };

  const isImageFile = (fileType: string) => {
    return fileType.startsWith('image/');
  };

  const isVideoFile = (fileType: string) => {
    return fileType.startsWith('video/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading post...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !posting) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || "Post not found"}</p>
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

  // Separate images from other attachments
  const imageAttachments = posting.attachments?.filter(att => isImageFile(att.fileType)) || [];
  const otherAttachments = posting.attachments?.filter(att => !isImageFile(att.fileType)) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <Link href="/posts">
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-gray-900">Post</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Post Card */}
        <Card className="border-0 shadow-sm bg-white">
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
                  <h3 className="font-semibold text-gray-900 truncate">
                    {posting.createdBy?.name || posting.organization?.name || "Unknown User"}
                  </h3>
                  {posting.organization && (
                    <Badge variant="secondary" className="text-xs">
                      {posting.organization.name}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
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
              <h2 className="text-xl font-semibold text-gray-900 leading-tight">
                {posting.title}
              </h2>
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {posting.content}
              </div>
            </div>
          </CardContent>

          {/* Image Attachments - Display inline like Facebook */}
          {imageAttachments.length > 0 && (
            <div className="px-6 pb-4">
              <div className="space-y-2">
                {imageAttachments.map((attachment) => (
                  <div key={attachment.id} className="relative">
                    <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={attachment.url}
                        alt={attachment.fileName || 'Image attachment'}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 600px"
                      />
                    </div>
                    {attachment.fileName && (
                      <p className="text-sm text-gray-500 mt-2 text-center">
                        {attachment.fileName}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other Attachments */}
          {otherAttachments.length > 0 && (
            <div className="px-6 pb-4">
              <div className="space-y-2">
                {otherAttachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <FileText className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{attachment.fileName || 'Unnamed file'}</p>
                      <p className="text-xs text-gray-500">
                        {attachment.fileType} • {attachment.size ? `${(attachment.size / 1024).toFixed(1)} KB` : 'Unknown size'}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <a 
                        href={attachment.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Download
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Engagement Stats */}
          <div className="px-6 py-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <ThumbsUp className="w-3 h-3 text-white" />
                </div>
                <span>42 likes</span>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setShowComments(!showComments)}
                  className="hover:text-gray-700 transition-colors"
                >
                  8 comments
                </button>
                <span>3 shares</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-6 py-2 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLike}
                className={`flex-1 flex items-center justify-center gap-2 py-2 ${
                  liked ? 'text-blue-600' : 'text-gray-600 hover:text-gray-700'
                }`}
              >
                <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                <span className="font-medium">Like</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowComments(!showComments)}
                className="flex-1 flex items-center justify-center gap-2 py-2 text-gray-600 hover:text-gray-700"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="font-medium">Comment</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="flex-1 flex items-center justify-center gap-2 py-2 text-gray-600 hover:text-gray-700"
              >
                <Share2 className="w-5 h-5" />
                <span className="font-medium">Share</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="p-2 text-gray-600 hover:text-gray-700"
              >
                <Bookmark className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Comments Section */}
          {showComments && (
            <div className="border-t border-gray-100">
              {/* Comment Input */}
              <div className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="/avatars/default.jpg" alt="User" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 flex items-center gap-2">
                    <Input
                      placeholder="Write a comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="flex-1 border-gray-200 focus:border-blue-500"
                      onKeyPress={(e) => e.key === 'Enter' && handleComment()}
                    />
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleComment}
                      disabled={!comment.trim()}
                      className="p-2 text-blue-600 hover:text-blue-700"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Sample Comments */}
              <div className="px-6 pb-4 space-y-4">
                <div className="flex items-start gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="/avatars/user1.jpg" alt="User" />
                    <AvatarFallback>J</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-2xl px-4 py-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm text-gray-900">John Doe</span>
                        <span className="text-xs text-gray-500">2h ago</span>
                      </div>
                      <p className="text-sm text-gray-700">Great post! This is exactly what I was looking for.</p>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <button className="hover:text-gray-700">Like</button>
                      <button className="hover:text-gray-700">Reply</button>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="/avatars/user2.jpg" alt="User" />
                    <AvatarFallback>S</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-2xl px-4 py-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm text-gray-900">Sarah Smith</span>
                        <span className="text-xs text-gray-500">1h ago</span>
                      </div>
                      <p className="text-sm text-gray-700">Thanks for sharing this information!</p>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <button className="hover:text-gray-700">Like</button>
                      <button className="hover:text-gray-700">Reply</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Share Section */}
        <div className="mt-6">
          <Card className="border-0 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-lg">Share This Post</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  // You could add a toast notification here
                }}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Copy Link
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <a 
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(posting.title)}&url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                  Share on Twitter
                </a>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <a 
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  Share on LinkedIn
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 