"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  ThumbsUp,
  Bookmark,
  Paperclip,
  FileText,
  Download,
  Image as ImageIcon,
  Send,
  RefreshCcw,
  ChevronUp,
  LayoutDashboard,
  Newspaper,
  User,
  LogOut,
  Moon,
  Sun
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePostings } from "@/hooks/usePostings";
import { PostType, PostingComment, UserRole } from "@/utils/types";
import Link from "next/link";
import Image from "next/image";
import { postingService } from "@/service/postingService";
import { useAuth } from "@/lib/auth-context";
import { useTheme } from "next-themes";

// ImageWithFallback component
interface ImageWithFallbackProps {
  attachment: { id: string; url?: string; fileName?: string };
  getViewableImageUrl: (attachment: {
    id: string;
    url?: string;
  }) => Promise<string>;
}

function ImageWithFallback({
  attachment,
  getViewableImageUrl,
}: ImageWithFallbackProps) {
  const [imageUrl, setImageUrl] = useState<string>("");
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
          <svg
            className="w-8 h-8 mx-auto mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            ></path>
          </svg>
          <p className="text-sm font-medium">
            {attachment.fileName || "Attachment"}
          </p>
          <p className="text-xs opacity-75">
            Click "View Full Post" to download
          </p>
        </div>
      </div>
    );
  }

  const isDataOrBlob =
    imageUrl.startsWith("data:") || imageUrl.startsWith("blob:");

  return (
    <div className="relative w-full" style={{ maxHeight: "600px" }}>
      {isDataOrBlob ? (
        <img
          src={imageUrl}
          alt={attachment.fileName || "Post image"}
          className="w-full h-auto object-contain rounded-lg max-h-[600px]"
          loading="lazy"
        />
      ) : (
        <Image
          src={imageUrl}
          alt={attachment.fileName || "Post image"}
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
  const { user, logoutUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [expandedAttachmentsByPost, setExpandedAttachmentsByPost] = useState<
    Record<string, boolean>
  >({});
  const ATTACHMENTS_PREVIEW_COUNT = 2;
  const [expandedCommentsByPost, setExpandedCommentsByPost] = useState<
    Record<string, boolean>
  >({});
  const [commentsByPost, setCommentsByPost] = useState<
    Record<string, PostingComment[]>
  >({});
  const [loadingCommentsByPost, setLoadingCommentsByPost] = useState<
    Record<string, boolean>
  >({});
  const [errorCommentsByPost, setErrorCommentsByPost] = useState<
    Record<string, string | undefined>
  >({});
  const [commentsCountByPost, setCommentsCountByPost] = useState<
    Record<string, number>
  >({});
  const [deleteCommentModal, setDeleteCommentModal] = useState<{
    isOpen: boolean;
    commentId: string;
    postingId: string;
    commentContent: string;
  }>({
    isOpen: false,
    commentId: "",
    postingId: "",
    commentContent: "",
  });
  const [editingComment, setEditingComment] = useState<{
    commentId: string;
    postingId: string;
    content: string;
  } | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    fetchPostings();
  }, [fetchPostings]);

  // Scroll to top listener
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Initialize comments count map from fetched postings
  useEffect(() => {
    const counts: Record<string, number> = {};
    for (const p of postings) {
      counts[p.id] = p._count?.comments ?? p.comments?.length ?? 0;
    }
    setCommentsCountByPost(counts);
  }, [postings]);

  // Auto-fetch comments for all loaded posts to keep counts accurate and ready to show
  useEffect(() => {
    if (!postings || postings.length === 0) return;
    let isCancelled = false;
    const load = async () => {
      await Promise.all(
        postings.map(async (p) => {
          if (commentsByPost[p.id]) return;
          try {
            const list = await postingService.getComments(p.id);
            if (isCancelled) return;
            setCommentsByPost((prev) => ({ ...prev, [p.id]: list }));
            setCommentsCountByPost((prev) => ({
              ...prev,
              [p.id]: list.length,
            }));
          } catch (e) {
            // ignore per-post fetch error here; UI handles on expand
          }
        })
      );
    };
    load();
    return () => {
      isCancelled = true;
    };
  }, [postings]);

  // Only show published posts for viewing
  const publishedPostings = postings.filter((posting) => posting.isPublished);

  const filteredPostings = publishedPostings.filter((posting) => {
    const matchesSearch =
      posting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      posting.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      selectedType === "all" || posting.postType === selectedType;

    return matchesSearch && matchesType;
  });

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
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      });
    }
  };

  const handleToggleComments = async (postId: string) => {
    const isOpen = !!expandedCommentsByPost[postId];
    if (!isOpen && !commentsByPost[postId] && !loadingCommentsByPost[postId]) {
      setLoadingCommentsByPost((prev) => ({ ...prev, [postId]: true }));
      setErrorCommentsByPost((prev) => ({ ...prev, [postId]: undefined }));
      try {
        const comments = await postingService.getComments(postId);
        setCommentsByPost((prev) => ({ ...prev, [postId]: comments }));
        setCommentsCountByPost((prev) => ({
          ...prev,
          [postId]: comments.length,
        }));
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Failed to load comments";
        setErrorCommentsByPost((prev) => ({ ...prev, [postId]: msg }));
      } finally {
        setLoadingCommentsByPost((prev) => ({ ...prev, [postId]: false }));
      }
    }
    setExpandedCommentsByPost((prev) => ({ ...prev, [postId]: !isOpen }));
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const diff = Date.now() - date.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const isImageFile = (fileType: string) => {
    return fileType.startsWith("image/");
  };

  // Function to get viewable image URL
  const getViewableImageUrl = async (attachment: {
    id: string;
    url?: string;
  }) => {
    if (!attachment || !attachment.url) return "";

    const url = attachment.url.trim();

    // If it's already a data URL, use it directly
    if (url.startsWith("data:")) {
      return url;
    }

    // If it's a regular URL, use it
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    // If it's a blob URL, we can't use it (it's already been revoked or is invalid)
    if (url.startsWith("blob:")) {
      return "";
    }

    return "";
  };

  const formatSize = (size?: number) => {
    if (!size || size <= 0) return "";
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
      await postingService.deleteComment(
        deleteCommentModal.postingId,
        deleteCommentModal.commentId
      );
      setCommentsByPost((prev) => ({
        ...prev,
        [deleteCommentModal.postingId]: (
          prev[deleteCommentModal.postingId] || []
        ).filter((x) => x.id !== deleteCommentModal.commentId),
      }));
      setCommentsCountByPost((prev) => ({
        ...prev,
        [deleteCommentModal.postingId]: Math.max(
          0,
          (prev[deleteCommentModal.postingId] ?? 1) - 1
        ),
      }));
      setDeleteCommentModal({
        isOpen: false,
        commentId: "",
        postingId: "",
        commentContent: "",
      });
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to delete comment";
      setErrorCommentsByPost((prev) => ({
        ...prev,
        [deleteCommentModal.postingId]: msg,
      }));
      setDeleteCommentModal({
        isOpen: false,
        commentId: "",
        postingId: "",
        commentContent: "",
      });
    }
  };

  const handleEditComment = async (
    commentId: string,
    postingId: string,
    newContent: string
  ) => {
    if (!newContent.trim()) return;

    try {
      // For now, we'll simulate editing by updating the local state
      // In a real app, you'd call an API endpoint to update the comment
      setCommentsByPost((prev) => ({
        ...prev,
        [postingId]: prev[postingId].map((c) =>
          c.id === commentId ? { ...c, content: newContent.trim() } : c
        ),
      }));
      setEditingComment(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to edit comment";
      setErrorCommentsByPost((prev) => ({ ...prev, [postingId]: msg }));
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <div className="min-h-screen bg-background w-full">
      <div className="flex">
        {/* Left Sidebar - User Menu - Fixed Position */}
        <div className="w-80 bg-card border-r border-border fixed left-0 top-16 bottom-0 p-8 overflow-y-auto z-10 hidden lg:block">
          <div className="space-y-8">
            {/* User Profile Section */}
            <div className="flex items-center gap-4 pb-6 border-b border-border/50">
              <Avatar className="w-14 h-14 ring-2 ring-primary/20 hover:ring-primary/40 transition-all duration-200">
                <AvatarImage
                  src={user?.profilePicture || "/avatars/default.jpg"}
                  alt={user?.name || "User"}
                />
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/40 text-primary font-semibold text-lg">
                  {user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate text-base">
                  {user?.name || "User"}
                </h3>
                <p className="text-sm text-muted-foreground truncate mt-0.5">
                  {user?.email}
                </p>
                {user?.role && (
                  <Badge className="mt-2 text-xs bg-primary/10 text-primary border-primary/20 px-2 py-1">
                    {user.role.replace("_", " ")}
                  </Badge>
                )}
              </div>
            </div>

            {/* Navigation Menu */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Navigation
              </h4>
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start h-11 px-3 hover:bg-primary/10 hover:text-primary transition-all duration-200 rounded-lg"
                  onClick={() => window.location.href = "/dashboard"}
                >
                  <LayoutDashboard className="w-5 h-5 mr-3" />
                  <span className="font-medium">Dashboard</span>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-11 px-3 bg-primary/10 text-primary hover:bg-primary/20 transition-all duration-200 rounded-lg"
                  onClick={() => window.location.href = "/posts"}
                >
                  <Newspaper className="w-5 h-5 mr-3" />
                  <span className="font-medium">Posts</span>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-11 px-3 hover:bg-primary/10 hover:text-primary transition-all duration-200 rounded-lg"
                  onClick={() => window.location.href = "/profile"}
                >
                  <User className="w-5 h-5 mr-3" />
                  <span className="font-medium">Profile</span>
                </Button>
              </div>
            </div>

            {/* User Actions */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Account
              </h4>
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start h-11 px-3 hover:bg-muted/50 transition-all duration-200 rounded-lg"
                  onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                >
                  {theme === "light" ? (
                    <Moon className="w-5 h-5 mr-3" />
                  ) : (
                    <Sun className="w-5 h-5 mr-3" />
                  )}
                  <span className="font-medium">Toggle Theme</span>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-11 px-3 text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-200 rounded-lg"
                  onClick={async () => {
                    try {
                      await logoutUser();
                      window.location.href = "/";
                    } catch (err) {
                      console.error("Logout error:", err);
                      alert("Failed to logout. Please try again.");
                    }
                  }}
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  <span className="font-medium">Log out</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Posts Content */}
        <div className="flex-1 lg:ml-80 pt-6">
          <div className="max-w-6xl mx-auto">
            <div className="w-full flex md:flex-row flex-col justify-between items-start gap-6 mb-8">
              {/* Header */}
              <div className="flex flex-col">
                <div className="flex items-center gap-4">
                  <h1 className="text-3xl font-bold text-foreground tracking-tight">Posts</h1>
                  {/* Mobile Menu Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="lg:hidden p-2 hover:bg-muted/50 transition-colors"
                    onClick={() => {
                      // You can add mobile menu toggle functionality here
                      console.log("Mobile menu toggle");
                    }}
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </Button>
                </div>
                <p className="text-muted-foreground mt-2 text-base">
                  Browse and read published posts and announcements
                </p>
              </div>

              {/* Filters */}
              <Card className="p-0 border-none shadow-none md:w-fit w-full">
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row gap-4 md:w-fit w-full">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search posts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-11 h-11 w-full md:w-80 rounded-xl border-border/50 focus:border-primary/50 transition-colors"
                      />
                    </div>

                    <div className="flex flex-row gap-3">
                      <Select value={selectedType} onValueChange={setSelectedType}>
                        <SelectTrigger className="md:w-40 w-full h-11 rounded-xl border-border/50 focus:border-primary/50 transition-colors">
                          <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value={PostType.JOB_LISTING}>
                            Job Listing
                          </SelectItem>
                          <SelectItem value={PostType.ANNOUNCEMENT}>
                            Announcement
                          </SelectItem>
                          <SelectItem value={PostType.NEWS}>News</SelectItem>
                          <SelectItem value={PostType.EVENT}>Event</SelectItem>
                          <SelectItem value={PostType.PROMOTION}>
                            Promotion
                          </SelectItem>
                          <SelectItem value={PostType.GENERAL}>General</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button 
                        variant="outline" 
                        onClick={fetchPostings}
                        className="h-11 px-4 rounded-xl border-border/50 hover:border-primary/50 transition-colors"
                      >
                        <RefreshCcw className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Posts Feed - Social Media Style */}
            <div className="space-y-6 max-w-5xl mx-auto pt-2">
          {filteredPostings.map((posting) => {
            // Get first image attachment for preview
            const imageAttachment = posting.attachments?.find(
              (att) => att.fileType && isImageFile(att.fileType)
            );
            const otherAttachments = (posting.attachments || []).filter(
              (att) => !imageAttachment || att.id !== imageAttachment.id
            );
            const isExpanded = !!expandedAttachmentsByPost[posting.id];
            const attachmentsToRender =
              otherAttachments.length > 0
                ? isExpanded
                  ? otherAttachments
                  : otherAttachments.slice(0, ATTACHMENTS_PREVIEW_COUNT)
                : [];

            return (
              <Card
                key={posting.id}
                className="rounded-xl border-0 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 bg-card/95 backdrop-blur-sm"
              >
                {/* Post Header */}
                <CardHeader className="p-6 pb-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12 ring-2 ring-primary/20 hover:ring-primary/40 transition-all duration-200">
                      <AvatarImage src="/avatars/default.jpg" alt="User" />
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/40 text-primary font-semibold">
                        {posting.createdBy?.name?.charAt(0) ||
                          posting.organization?.name?.charAt(0) ||
                          "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col w-full gap-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-foreground text-base">
                            {posting.createdBy?.name ||
                              posting.organization?.name ||
                              "Unknown User"}
                          </h3>
                          {posting.organization && (
                            <Badge variant="secondary" className="text-xs px-2 py-1 bg-muted/50 rounded-full">
                              {posting.organization.name}
                            </Badge>
                          )}
                        </div>
                        <Button variant="ghost" size="sm" className="p-2 hover:bg-muted/50 rounded-lg transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="hover:text-foreground transition-colors cursor-pointer">
                          {formatDate(posting.createdAt)}
                        </span>
                        <span>•</span>
                        <Badge
                          className={`text-xs px-3 py-1 font-medium rounded-full ${getPostTypeColor(
                            posting.postType
                          )}`}
                        >
                          {posting.postType.replace("_", " ")}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                {/* Post Content */}
                <CardContent className="px-6 pt-0 pb-5">
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-foreground leading-tight hover:text-primary transition-colors cursor-pointer">
                      {posting.title}
                    </h2>
                    <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-base">
                      {posting.content && posting.content.length > 300
                        ? `${posting.content.substring(0, 300)}...`
                        : posting.content}
                    </div>
                    {posting.content && posting.content.length > 300 && (
                      <button className="text-primary hover:text-primary/80 text-sm font-medium transition-colors">
                        See more
                      </button>
                    )}
                  </div>
                </CardContent>

                {/* Image Preview */}
                {imageAttachment && (
                  <div className="px-6 pb-4">
                    <div className="relative w-full bg-muted/20 rounded-xl overflow-hidden ring-1 ring-border/30 hover:ring-border/50 transition-all duration-200 group cursor-pointer">
                      <ImageWithFallback
                        attachment={imageAttachment}
                        getViewableImageUrl={getViewableImageUrl}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-200" />
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
                          <div className="flex items-center justify-between p-3 border border-border/60 rounded-lg hover:bg-muted/30 transition-colors">
                            <div className="flex items-center gap-3 min-w-0">
                              <ImageIcon className="w-5 h-5 text-blue-500" />
                              <div className="truncate">
                                <p className="font-medium text-sm truncate">
                                  {imageAttachment.fileName || "Image"}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                  {imageAttachment.fileType}{" "}
                                  {imageAttachment.size
                                    ? `• ${formatSize(imageAttachment.size)}`
                                    : ""}
                                </p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                              <a
                                href={imageAttachment.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                download={imageAttachment.fileName}
                              >
                                <Download className="w-4 h-4 mr-2" /> Download
                              </a>
                            </Button>
                          </div>
                        ) : null
                      ) : (
                        <>
                          {attachmentsToRender.map((att) => (
                            <div
                              key={att.id}
                              className="flex items-center justify-between p-3 border border-border/60 rounded-lg hover:bg-muted/30 transition-colors"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                {att.fileType && isImageFile(att.fileType) ? (
                                  <ImageIcon className="w-5 h-5 text-blue-500" />
                                ) : (
                                  <FileText className="w-5 h-5 text-gray-500" />
                                )}
                                <div className="truncate">
                                  <p className="font-medium text-sm truncate">
                                    {att.fileName || "Attachment"}
                                  </p>
                                  <p className="text-xs text-muted-foreground truncate">
                                    {att.fileType}{" "}
                                    {att.size
                                      ? `• ${formatSize(att.size)}`
                                      : ""}
                                  </p>
                                </div>
                              </div>
                              <Button variant="outline" size="sm" asChild>
                                <a
                                  href={att.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  download={att.fileName}
                                >
                                  <Download className="w-4 h-4 mr-2" /> Download
                                </a>
                              </Button>
                            </div>
                          ))}
                          {otherAttachments.length >
                            ATTACHMENTS_PREVIEW_COUNT && (
                            <div className="pt-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-foreground/80 hover:text-foreground"
                                onClick={() =>
                                  setExpandedAttachmentsByPost((prev) => ({
                                    ...prev,
                                    [posting.id]: !isExpanded,
                                  }))
                                }
                              >
                                {isExpanded
                                  ? "See less"
                                  : `See more... (${
                                      otherAttachments.length -
                                      ATTACHMENTS_PREVIEW_COUNT
                                    } more)`}
                              </Button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Engagement Stats */}
                <div className="px-6 py-4 border-t border-border/30">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 hover:text-foreground transition-colors cursor-pointer">
                        <div className="w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                          <Heart className="w-3 h-3 text-white fill-white" />
                        </div>
                        <span className="font-medium">42</span>
                      </div>
                      <div className="flex items-center gap-2 hover:text-foreground transition-colors cursor-pointer">
                        <MessageCircle className="w-5 h-5" />
                        <span className="font-medium">
                          {commentsCountByPost[posting.id] ?? 0}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 hover:text-foreground transition-colors cursor-pointer">
                        <Share2 className="w-5 h-5" />
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
                      <Heart className="w-5 h-5" />
                      <span className="font-medium">Like</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 flex items-center justify-center gap-2 py-3 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 rounded-xl transition-all duration-200"
                      onClick={() => handleToggleComments(posting.id)}
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span className="font-medium">Comment</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 flex items-center justify-center gap-2 py-3 text-muted-foreground hover:text-green-500 hover:bg-green-500/10 rounded-xl transition-all duration-200"
                    >
                      <Share2 className="w-5 h-5" />
                      <span className="font-medium">Share</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-3 text-muted-foreground hover:text-yellow-500 hover:bg-yellow-500/10 rounded-xl transition-all duration-200"
                    >
                      <Bookmark className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* View Post Button */}
                {!expandedCommentsByPost[posting.id] && (
                  <div className="px-6 pb-6">
                    <Link href={`/posts/view/${posting.id}`}>
                      <Button
                        variant="outline"
                        className="w-full rounded-xl border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-200"
                        size="sm"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Full Post
                      </Button>
                    </Link>
                  </div>
                )}
                {expandedCommentsByPost[posting.id] && (
                  <div className="px-6 pt-4 pb-6 border-t border-border/30 bg-muted/5">
                    {loadingCommentsByPost[posting.id] && (
                      <div className="text-sm text-muted-foreground">
                        Loading comments...
                      </div>
                    )}
                    {errorCommentsByPost[posting.id] && (
                      <div className="text-sm text-destructive">
                        {errorCommentsByPost[posting.id]}
                      </div>
                    )}
                    {!loadingCommentsByPost[posting.id] &&
                      commentsByPost[posting.id] && (
                        <div className="space-y-3">
                          {commentsByPost[posting.id].length === 0 ? (
                            <div className="text-sm text-muted-foreground">
                              No comments yet.
                            </div>
                          ) : (
                            commentsByPost[posting.id].map((c) => (
                              <div
                                key={c.id}
                                className="flex items-start gap-3"
                              >
                                <div className="w-8 h-8 rounded-full bg-muted/70 flex items-center justify-center text-xs font-medium ring-1 ring-border/60">
                                  {(
                                    c.user?.name ||
                                    c.user?.email ||
                                    "U"
                                  ).charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 text-sm">
                                    <span className="font-medium text-foreground truncate max-w-[200px]">
                                      {c.user?.name || c.user?.email || "User"}
                                    </span>
                                    <span className="text-muted-foreground">
                                      • {formatTimeAgo(c.createdAt)}
                                    </span>
                                    {/* Comment actions */}
                                    {user &&
                                      (user.id === c.userId ||
                                        user.id === posting.createdBy?.id) && (
                                        <div className="ml-auto relative">
                                          <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                              <button
                                                type="button"
                                                className="p-1 rounded hover:bg-muted"
                                                title="More"
                                              >
                                                <MoreHorizontal className="w-4 h-4" />
                                              </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                              {user.id === c.userId && (
                                                <DropdownMenuItem
                                                  onClick={() =>
                                                    setEditingComment({
                                                      commentId: c.id,
                                                      postingId: posting.id,
                                                      content: c.content,
                                                    })
                                                  }
                                                >
                                                  Edit
                                                </DropdownMenuItem>
                                              )}
                                              <DropdownMenuItem
                                                onClick={() =>
                                                  setDeleteCommentModal({
                                                    isOpen: true,
                                                    commentId: c.id,
                                                    postingId: posting.id,
                                                    commentContent: c.content,
                                                  })
                                                }
                                                className="text-destructive focus:text-destructive"
                                              >
                                                Delete
                                              </DropdownMenuItem>
                                            </DropdownMenuContent>
                                          </DropdownMenu>
                                        </div>
                                      )}
                                  </div>
                                  {editingComment?.commentId === c.id ? (
                                    <div className="mt-2 space-y-2">
                                      <textarea
                                        value={editingComment.content}
                                        onChange={(e) =>
                                          setEditingComment((prev) =>
                                            prev
                                              ? {
                                                  ...prev,
                                                  content: e.target.value,
                                                }
                                              : null
                                          )
                                        }
                                        className="w-full px-3 py-2 text-sm border rounded-lg bg-background resize-none"
                                        rows={2}
                                        autoFocus
                                      />
                                      <div className="flex gap-2">
                                        <Button
                                          size="sm"
                                          onClick={() =>
                                            handleEditComment(
                                              c.id,
                                              posting.id,
                                              editingComment.content
                                            )
                                          }
                                        >
                                          Save
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() =>
                                            setEditingComment(null)
                                          }
                                        >
                                          Cancel
                                        </Button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="text-sm text-foreground/90 whitespace-pre-wrap bg-muted/30 inline-block px-3 py-2 rounded-2xl">
                                      {c.content}
                                    </div>
                                  )}
                                  <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                                    <button
                                      className="hover:underline"
                                      type="button"
                                    >
                                      Like
                                    </button>
                                    <button
                                      className="hover:underline"
                                      type="button"
                                    >
                                      Reply
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                          {user ? (
                            <form
                              className="mt-4 flex items-center gap-3"
                              onSubmit={async (e) => {
                                e.preventDefault();
                                const form = e.currentTarget as HTMLFormElement;
                                const input = form.elements.namedItem(
                                  "newComment"
                                ) as HTMLInputElement;
                                const content = input.value.trim();
                                if (!content) return;
                                try {
                                  const created =
                                    await postingService.createComment(
                                      posting.id,
                                      content
                                    );
                                  setCommentsByPost((prev) => ({
                                    ...prev,
                                    [posting.id]: [
                                      ...(prev[posting.id] || []),
                                      created,
                                    ],
                                  }));
                                  setCommentsCountByPost((prev) => ({
                                    ...prev,
                                    [posting.id]: (prev[posting.id] ?? 0) + 1,
                                  }));
                                  input.value = "";
                                } catch (err) {
                                  const msg =
                                    err instanceof Error
                                      ? err.message
                                      : "Failed to add comment";
                                  setErrorCommentsByPost((prev) => ({
                                    ...prev,
                                    [posting.id]: msg,
                                  }));
                                }
                              }}
                            >
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={user?.profilePicture || "/avatars/default.jpg"} alt={user?.name || "User"} />
                                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/40 text-primary font-semibold text-xs">
                                  {user?.name?.charAt(0) || "U"}
                                </AvatarFallback>
                              </Avatar>
                              <input
                                type="text"
                                name="newComment"
                                placeholder="Write a comment..."
                                className="flex-1 px-4 py-3 border border-border/30 rounded-full bg-background/50 text-sm focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-0 focus-visible:border-primary/50 transition-all duration-200"
                              />
                              <Button
                                type="submit"
                                size="sm"
                                className="rounded-full h-10 w-10 p-0 flex items-center justify-center bg-primary hover:bg-primary/90 transition-all duration-200"
                              >
                                <Send className="w-4 h-4" />
                              </Button>
                            </form>
                          ) : (
                            <div className="mt-4 text-sm text-muted-foreground">
                              <Link href="/" className="underline hover:text-foreground transition-colors">
                                Log in
                              </Link>{" "}
                              to comment.
                            </div>
                          )}
                        </div>
                      )}
                  </div>
                )}
              </Card>
            );
          })}
          
          {filteredPostings.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                No published posts found
              </p>
            </div>
          )}
        </div>
          </div>
        </div>

        {/* Delete Comment Modal */}
        <Dialog
          open={deleteCommentModal.isOpen}
          onOpenChange={(open) => {
            if (!open) {
              setDeleteCommentModal({
                isOpen: false,
                commentId: "",
                postingId: "",
                commentContent: "",
              });
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Comment</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this comment? This action cannot
                be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">Comment:</p>
                <p className="text-sm mt-1">
                  {deleteCommentModal.commentContent}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() =>
                  setDeleteCommentModal({
                    isOpen: false,
                    commentId: "",
                    postingId: "",
                    commentContent: "",
                  })
                }
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteComment}>
                Delete Comment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Floating Scroll to Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 bg-primary text-primary-foreground p-3 rounded-full shadow-lg hover:bg-primary/90 transition-all duration-200 z-50"
            aria-label="Scroll to top"
          >
            <ChevronUp className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}
