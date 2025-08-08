'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ImageUploadService, UploadResponse } from '@/service/imageUploadService';
import { Camera, Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (url: string) => void;
  type: 'profile' | 'cover';
  currentImage?: string;
  title: string;
  description: string;
  aspectRatio?: 'square' | 'wide';
}

export function ImageUploadModal({
  isOpen,
  onClose,
  onSuccess,
  type,
  currentImage,
  title,
  description,
  aspectRatio = 'square'
}: ImageUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (max 20MB)
    if (file.size > 20 * 1024 * 1024) {
      setError('File size must be less than 20MB');
      return;
    }

    setError(null);
    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 100);

      const result: UploadResponse = await ImageUploadService.uploadImage(selectedFile, type);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result.success && result.url) {
        onSuccess(result.url);
        onClose();
        resetState();
      } else {
        setError(result.error || 'Upload failed');
      }
    } catch (err) {
      setError('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const resetState = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadProgress(0);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    if (!isUploading) {
      resetState();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {description}
          </p>

          {/* Current Image Preview */}
          {currentImage && (
            <div className="space-y-2">
              <Label>Current {type === 'profile' ? 'Profile Picture' : 'Cover Photo'}</Label>
              <div className={`relative overflow-hidden rounded-lg border ${
                aspectRatio === 'square' ? 'w-32 h-32' : 'w-full h-32'
              }`}>
                <Image
                  src={currentImage}
                  alt={`Current ${type}`}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}

          {/* File Upload Area */}
          <div className="space-y-2">
            <Label htmlFor="image-upload">Select New Image</Label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
              <input
                ref={fileInputRef}
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="space-y-2">
                <Upload className="h-8 w-8 mx-auto text-gray-400" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  PNG, JPG, GIF up to 20MB
                </p>
              </div>
            </div>
          </div>

          {/* Preview */}
          {previewUrl && (
            <div className="space-y-2">
              <Label>Preview</Label>
              <div className={`relative overflow-hidden rounded-lg border ${
                aspectRatio === 'square' ? 'w-32 h-32' : 'w-full h-32'
              }`}>
                <Image
                  src={previewUrl}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="gap-2"
          >
            {isUploading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Uploading...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                Upload & Save
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
