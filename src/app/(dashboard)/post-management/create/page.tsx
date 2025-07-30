"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { usePostings } from "@/hooks/usePostings";
import { PostType, CreatePostingRequest } from "@/utils/types";
import Link from "next/link";

export default function CreatePostPage() {
  const router = useRouter();
  const { createPosting, addAttachment } = usePostings();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    postType: PostType.GENERAL,
    isPublished: false,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setSaving(true);
    setError(null);

    try {
      const createData: CreatePostingRequest = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        postType: formData.postType,
        isPublished: formData.isPublished,
      };

      const newPosting = await createPosting(createData);

      // Upload attachments if any
      if (attachments.length > 0) {
        for (const file of attachments) {
          // For now, we'll use a placeholder URL. In a real app, you'd upload to a file service
          const attachmentData = {
            url: URL.createObjectURL(file), // This is temporary - in production, upload to cloud storage
            fileName: file.name,
            fileType: file.type,
            size: file.size,
          };
          
          await addAttachment(newPosting.id, attachmentData);
        }
      }

      router.push(`/post-management/${newPosting.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/post-management">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Management
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Create New Post</h1>
            <p className="text-muted-foreground">Create a new post or announcement</p>
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
                  Write your post title and content
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

            {/* Attachments */}
            <Card>
              <CardHeader>
                <CardTitle>Attachments</CardTitle>
                <CardDescription>
                  Add files to your post (e.g., images, documents)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="attachments" className="text-sm">
                    Select files to upload (max 5MB each)
                  </Label>
                  <Input
                    type="file"
                    id="attachments"
                    multiple
                    onChange={handleFileChange}
                    accept=".jpg, .jpeg, .png, .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx"
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {attachments.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {attachments.map((file, index) => (
                        <div key={index} className="flex items-center bg-gray-100 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                          {file.name}
                          <button
                            type="button"
                            onClick={() => removeAttachment(index)}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
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
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Create Post
                    </>
                  )}
                </Button>

                <Link href="/post-management">
                  <Button variant="outline" className="w-full" disabled={saving}>
                    Cancel
                  </Button>
                </Link>
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