"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, X, Image as ImageIcon, FileText, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { postingService } from "@/service/postingService";
import { useAuth } from "@/lib/auth-context";
import { Posting, PostType, UpdatePostingRequest, UserRole } from "@/utils/types";
import Link from "next/link";

// Helper function to convert file to base64
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

// Helper function to generate unique filename
const generateUniqueFileName = (originalName: string): string => {
  const timestamp = Date.now();
  const fileExtension = originalName.split('.').pop() || '';
  const fileNameWithoutExt = originalName.replace(`.${fileExtension}`, '');
  return `${fileNameWithoutExt}_${timestamp}.${fileExtension}`;
};

// Helper function to get file extension
const getFileExtension = (filename: string): string => {
  return filename.split('.').pop() || '';
};

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [posting, setPosting] = useState<Posting | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newAttachments, setNewAttachments] = useState<File[]>([]);
  const [removingAttachments, setRemovingAttachments] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    postType: PostType.GENERAL,
    isPublished: false,
  });

  const postId = params.id as string;

  // Helper function to check if file is an image
  const isImageFile = (fileType: string) => {
    return fileType.startsWith('image/');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles: File[] = [];
    const maxFileSize = 5 * 1024 * 1024; // 5MB limit per file
    
    for (const file of files) {
      if (file.size > maxFileSize) {
        setError(`File "${file.name}" is too large. Maximum size is 5MB per file.`);
        continue;
      }
      validFiles.push(file);
    }
    
    if (validFiles.length > 0) {
      setNewAttachments(prev => [...prev, ...validFiles]);
      setError(null); // Clear any previous errors if valid files are added
    }
    
    // Clear the input value to allow re-uploading the same file
    e.target.value = '';
  };

  const removeNewAttachment = (index: number) => {
    setNewAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingAttachment = async (attachmentId: string) => {
    if (!posting) return;
    
    setRemovingAttachments(prev => new Set(prev).add(attachmentId));
    
    try {
      await postingService.deleteAttachment(attachmentId);
      // Update the posting state to remove the attachment
      setPosting(prev => prev ? {
        ...prev,
        attachments: prev.attachments.filter(att => att.id !== attachmentId)
      } : null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove attachment');
    } finally {
      setRemovingAttachments(prev => {
        const newSet = new Set(prev);
        newSet.delete(attachmentId);
        return newSet;
      });
    }
  };

  useEffect(() => {
    const fetchPosting = async () => {
      try {
        const data = await postingService.getPostingById(postId);
        
        // Check if user has permission to edit this post
        if (user?.role !== UserRole.SUPERADMIN) {
          const isOwner = data.createdBy?.id === user?.id || data.createdBy?.email === user?.email;
          if (!isOwner) {
            setError("You don't have permission to edit this post");
            setLoading(false);
            return;
          }
        }
        
        setPosting(data);
        setFormData({
          title: data.title,
          content: data.content,
          postType: data.postType,
          isPublished: data.isPublished,
        });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!posting) return;

    setSaving(true);
    setError(null);

    try {
      const updateData: UpdatePostingRequest = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        postType: formData.postType,
        isPublished: formData.isPublished,
      };

      await postingService.updatePosting(posting.id, updateData);

      // Upload new attachments if any
      if (newAttachments.length > 0) {
        for (const file of newAttachments) {
          try {
            // Generate unique filename
            const uniqueFileName = generateUniqueFileName(file.name);
            
            // Convert file to base64
            const base64Data = await convertFileToBase64(file);
            const attachmentData = {
              url: `data:${file.type};base64,${base64Data}`,
              fileName: uniqueFileName,
              fileType: file.type,
              size: file.size,
            };
            
            await postingService.addAttachment(posting.id, attachmentData);
          } catch (attachmentError) {
            console.error(`Failed to upload attachment ${file.name}:`, attachmentError);
            setError(`Failed to upload attachment "${file.name}". Post updated successfully but some attachments failed.`);
          }
        }
      }

      router.push(`/post-management/${posting.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update post');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push(`/post-management/${posting?.id || '/post-management'}`);
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
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href={`/post-management/${posting.id}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Post
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Edit Post</h1>
            <p className="text-muted-foreground">Update post content and settings</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Post Content</CardTitle>
                <CardDescription>
                  Update the title and content of your post
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter post title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Enter post content"
                    rows={12}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Existing Attachments */}
            {posting.attachments && posting.attachments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Current Attachments</CardTitle>
                  <CardDescription>
                    Files currently attached to this post
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {posting.attachments.map((attachment) => (
                      <div key={attachment.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {isImageFile(attachment.fileType || '') ? (
                            <ImageIcon className="w-5 h-5 text-blue-500" />
                          ) : (
                            <FileText className="w-5 h-5 text-gray-500" />
                          )}
                          <div>
                            <p className="font-medium text-sm">{attachment.fileName || 'Unnamed file'}</p>
                            <p className="text-xs text-muted-foreground">
                              {attachment.fileType} • {attachment.size ? `${(attachment.size / 1024).toFixed(1)} KB` : 'Unknown size'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" asChild>
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
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeExistingAttachment(attachment.id)}
                            disabled={removingAttachments.has(attachment.id)}
                            className="text-destructive hover:text-destructive/80"
                          >
                            {removingAttachments.has(attachment.id) ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Add New Attachments */}
            <Card>
              <CardHeader>
                <CardTitle>Add New Attachments</CardTitle>
                <CardDescription>
                  Add additional files to your post (e.g., images, documents)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="new-attachments" className="text-sm">
                    Select files to upload (max 5MB each)
                  </Label>
                  <Input
                    type="file"
                    id="new-attachments"
                    multiple
                    onChange={handleFileChange}
                    accept=".jpg, .jpeg, .png, .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx"
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {newAttachments.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm text-muted-foreground">
                        {newAttachments.length} new file{newAttachments.length !== 1 ? 's' : ''} selected
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {newAttachments.map((file, index) => (
                          <div key={index} className="flex items-center gap-2 bg-muted text-foreground text-sm px-3 py-2 rounded-lg border">
                            {isImageFile(file.type) ? (
                              <ImageIcon className="w-4 h-4 text-blue-500" />
                            ) : (
                              <FileText className="w-4 h-4 text-gray-500" />
                            )}
                            <span className="truncate max-w-32" title={file.name}>{file.name}</span>
                            <span className="text-xs text-muted-foreground">
                              ({(file.size / 1024).toFixed(1)} KB)
                            </span>
                            <button
                              type="button"
                              onClick={() => removeNewAttachment(index)}
                              className="ml-1 text-destructive hover:text-destructive/80"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Post Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Post Settings</CardTitle>
                <CardDescription>
                  Configure post type and visibility
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="postType">Post Type</Label>
                  <Select
                    value={formData.postType}
                    onValueChange={(value: PostType) => setFormData(prev => ({ ...prev, postType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select post type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(PostType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.replace('_', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="isPublished">Publish Post</Label>
                    <p className="text-sm text-muted-foreground">
                      Make this post visible to others
                    </p>
                  </div>
                  <Switch
                    id="isPublished"
                    checked={formData.isPublished}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublished: checked }))}
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
                  disabled={saving || !formData.title.trim() || !formData.content.trim()}
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </CardContent>
            </Card>

            {/* Error Display */}
            {error && (
              <Card className="border-destructive">
                <CardContent className="pt-6">
                  <p className="text-destructive text-sm">{error}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </form>
    </div>
  );
} 