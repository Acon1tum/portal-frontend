"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Upload, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { usePostings } from "@/hooks/usePostings";
import { PostType } from "@/utils/types";
import Link from "next/link";
import Image from "next/image";

interface FileAttachment {
  id: string;
  fileName: string;
  fileType: string;
  size: number;
  base64Data: string;
  previewUrl?: string;
}

export default function CreatePostPage() {
  const router = useRouter();
  const { createPosting, loading } = usePostings();
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    postType: PostType.GENERAL,
    isPublished: false,
  });
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64Data = base64String.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = error => reject(error);
    });
  };

  const isImageFile = (fileType: string): boolean => {
    return fileType.startsWith('image/');
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newAttachments: FileAttachment[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      try {
        const base64Data = await convertFileToBase64(file);
        const attachment: FileAttachment = {
          id: `temp-${Date.now()}-${i}`,
          fileName: file.name,
          fileType: file.type,
          size: file.size,
          base64Data,
        };

        // Create preview URL for images
        if (isImageFile(file.type)) {
          attachment.previewUrl = URL.createObjectURL(file);
        }

        newAttachments.push(attachment);
      } catch (error) {
        console.error('Error converting file to base64:', error);
        setErrors(prev => ({ 
          ...prev, 
          attachments: `Failed to process file: ${file.name}` 
        }));
      }
    }

    setAttachments(prev => [...prev, ...newAttachments]);
    setErrors(prev => ({ ...prev, attachments: "" }));
  };

  const removeAttachment = (attachmentId: string) => {
    setAttachments(prev => {
      const attachment = prev.find(att => att.id === attachmentId);
      if (attachment?.previewUrl) {
        URL.revokeObjectURL(attachment.previewUrl);
      }
      return prev.filter(att => att.id !== attachmentId);
    });
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
      
      // Convert attachments to the format expected by the API
      const attachmentData = attachments.map(att => ({
        url: `data:${att.fileType};base64,${att.base64Data}`,
        fileName: att.fileName,
        fileType: att.fileType,
        size: att.size,
      }));

      await createPosting({
        title: formData.title.trim(),
        content: formData.content.trim(),
        postType: formData.postType,
        organizationId,
        isPublished: formData.isPublished,
        attachments: attachmentData,
      });

      router.push("/posts");
    } catch (err) {
      console.error("Failed to create post:", err);
      setErrors({ submit: "Failed to create post. Please try again." });
    }
  };

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      attachments.forEach(attachment => {
        if (attachment.previewUrl) {
          URL.revokeObjectURL(attachment.previewUrl);
        }
      });
    };
  }, []);

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

            {/* Attachments */}
            <Card>
              <CardHeader>
                <CardTitle>Attachments</CardTitle>
                <CardDescription>
                  Add files or images to your post
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* File Upload */}
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                    accept="image/*,.pdf,.doc,.docx,.txt"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload files or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Supports images, PDFs, and documents (max 10MB each)
                    </p>
                  </label>
                </div>

                {/* Attachment List */}
                {attachments.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-foreground">Attached Files ({attachments.length})</h4>
                    <div className="space-y-2">
                      {attachments.map((attachment) => (
                        <div
                          key={attachment.id}
                          className="flex items-center gap-3 p-3 border border-border rounded-lg"
                        >
                          {/* File Icon or Image Preview */}
                          <div className="flex-shrink-0">
                            {isImageFile(attachment.fileType) && attachment.previewUrl ? (
                              <div className="relative w-12 h-12 rounded overflow-hidden">
                                <Image
                                  src={attachment.previewUrl}
                                  alt={attachment.fileName}
                                  fill
                                  className="object-cover"
                                  sizes="48px"
                                />
                              </div>
                            ) : (
                              <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                                <FileText className="w-6 h-6 text-muted-foreground" />
                              </div>
                            )}
                          </div>

                          {/* File Info */}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">
                              {attachment.fileName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {attachment.fileType} • {(attachment.size / 1024).toFixed(1)} KB
                            </p>
                          </div>

                          {/* Remove Button */}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAttachment(attachment.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {errors.attachments && (
                  <p className="text-sm text-destructive">{errors.attachments}</p>
                )}
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
                  Select the type of post you&apos;re creating
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