"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { usePostings } from "@/hooks/usePostings";
import { useAuth } from "@/lib/auth-context";
import { PostType } from "@/utils/types";
import Link from "next/link";

export default function CreatePostPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { createPosting, loading } = usePostings();
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    postType: PostType.GENERAL,
    isPublished: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
    }

    if (formData.content.length < 10) {
      newErrors.content = "Content must be at least 10 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // For now, we'll use a default organization ID
      // In a real app, you'd get this from the user's organization
      const organizationId = "default-org-id"; // This should come from user context
      
      await createPosting({
        title: formData.title.trim(),
        content: formData.content.trim(),
        postType: formData.postType,
        organizationId,
        isPublished: formData.isPublished,
      });

      router.push("/posts");
    } catch (err) {
      console.error("Failed to create post:", err);
      setErrors({ submit: "Failed to create post. Please try again." });
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/posts">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Posts
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Create New Post</h1>
          <p className="text-muted-foreground">Create a new post or announcement for your organization</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <Card>
              <CardHeader>
                <CardTitle>Post Title</CardTitle>
                <CardDescription>
                  Enter a clear and descriptive title for your post
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="Enter post title..."
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className={errors.title ? "border-destructive" : ""}
                />
                {errors.title && (
                  <p className="text-sm text-destructive mt-1">{errors.title}</p>
                )}
              </CardContent>
            </Card>

            {/* Content */}
            <Card>
              <CardHeader>
                <CardTitle>Post Content</CardTitle>
                <CardDescription>
                  Write the main content of your post
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Write your post content here..."
                  value={formData.content}
                  onChange={(e) => handleInputChange("content", e.target.value)}
                  className={`min-h-[300px] ${errors.content ? "border-destructive" : ""}`}
                />
                {errors.content && (
                  <p className="text-sm text-destructive mt-1">{errors.content}</p>
                )}
                <div className="flex justify-between items-center mt-2 text-sm text-muted-foreground">
                  <span>{formData.content.length} characters</span>
                  <span>Minimum 10 characters</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Post Type */}
            <Card>
              <CardHeader>
                <CardTitle>Post Type</CardTitle>
                <CardDescription>
                  Select the type of post you're creating
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Select
                  value={formData.postType}
                  onValueChange={(value) => handleInputChange("postType", value as PostType)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={PostType.GENERAL}>General</SelectItem>
                    <SelectItem value={PostType.ANNOUNCEMENT}>Announcement</SelectItem>
                    <SelectItem value={PostType.NEWS}>News</SelectItem>
                    <SelectItem value={PostType.EVENT}>Event</SelectItem>
                    <SelectItem value={PostType.JOB_LISTING}>Job Listing</SelectItem>
                    <SelectItem value={PostType.PROMOTION}>Promotion</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Publishing Options */}
            <Card>
              <CardHeader>
                <CardTitle>Publishing</CardTitle>
                <CardDescription>
                  Control when and how your post is published
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="publish">Publish immediately</Label>
                    <p className="text-sm text-muted-foreground">
                      Make this post visible to everyone
                    </p>
                  </div>
                  <Switch
                    id="publish"
                    checked={formData.isPublished}
                    onCheckedChange={(checked) => handleInputChange("isPublished", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {formData.isPublished ? "Publish Post" : "Save as Draft"}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push("/posts")}
                  disabled={loading}
                >
                  Cancel
                </Button>

                {errors.submit && (
                  <p className="text-sm text-destructive text-center">{errors.submit}</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
} 