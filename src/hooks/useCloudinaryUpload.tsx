import { useState } from 'react';
import { uploadImage, deleteImage, type CloudinaryUploadResult, type UploadOptions } from '@/lib/cloudinary';
import { toast } from 'sonner';

interface UseCloudinaryUploadReturn {
  uploadFile: (file: File, options?: UploadOptions) => Promise<CloudinaryUploadResult | null>;
  deleteFile: (publicId: string) => Promise<boolean>;
  isUploading: boolean;
  isDeleting: boolean;
  uploadProgress: number;
}

export const useCloudinaryUpload = (): UseCloudinaryUploadReturn => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadFile = async (
    file: File,
    options: UploadOptions = {}
  ): Promise<CloudinaryUploadResult | null> => {
    if (!file) {
      toast.error('No file selected');
      return null;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return null;
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error('File size must be less than 10MB');
      return null;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const result = await uploadImage(file, options);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      toast.success('Image uploaded successfully');
      return result;
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
      return null;
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const deleteFile = async (publicId: string): Promise<boolean> => {
    if (!publicId) {
      toast.error('No image to delete');
      return false;
    }

    setIsDeleting(true);

    try {
      await deleteImage(publicId);
      toast.success('Image deleted successfully');
      return true;
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete image');
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    uploadFile,
    deleteFile,
    isUploading,
    isDeleting,
    uploadProgress,
  };
};