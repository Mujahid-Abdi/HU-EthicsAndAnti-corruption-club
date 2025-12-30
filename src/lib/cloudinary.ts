import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  api_key: import.meta.env.VITE_CLOUDINARY_API_KEY,
  api_secret: import.meta.env.VITE_CLOUDINARY_API_SECRET,
});

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  bytes: number;
}

export interface UploadOptions {
  folder?: string;
  transformation?: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string | number;
  };
  tags?: string[];
}

/**
 * Upload an image to Cloudinary
 * @param file - File object or base64 string
 * @param options - Upload options
 * @returns Promise with upload result
 */
export const uploadImage = async (
  file: File | string,
  options: UploadOptions = {}
): Promise<CloudinaryUploadResult> => {
  try {
    let fileData: string;
    
    if (file instanceof File) {
      // Convert File to base64
      fileData = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    } else {
      fileData = file;
    }

    const uploadOptions: any = {
      resource_type: 'image',
      ...options,
    };

    if (options.transformation) {
      uploadOptions.transformation = options.transformation;
    }

    const result = await cloudinary.uploader.upload(fileData, uploadOptions);
    
    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      resource_type: result.resource_type,
      created_at: result.created_at,
      bytes: result.bytes,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
};

/**
 * Delete an image from Cloudinary
 * @param publicId - The public ID of the image to delete
 * @returns Promise with deletion result
 */
export const deleteImage = async (publicId: string): Promise<{ result: string }> => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete image from Cloudinary');
  }
};

/**
 * Generate a Cloudinary URL with transformations
 * @param publicId - The public ID of the image
 * @param transformations - Transformation options
 * @returns Transformed image URL
 */
export const getTransformedImageUrl = (
  publicId: string,
  transformations: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string | number;
    format?: string;
  } = {}
): string => {
  return cloudinary.url(publicId, {
    ...transformations,
    secure: true,
  });
};

/**
 * Common image transformations
 */
export const imageTransformations = {
  thumbnail: { width: 150, height: 150, crop: 'fill', quality: 'auto' },
  medium: { width: 400, height: 300, crop: 'fill', quality: 'auto' },
  large: { width: 800, height: 600, crop: 'fill', quality: 'auto' },
  avatar: { width: 100, height: 100, crop: 'fill', quality: 'auto', format: 'jpg' },
  hero: { width: 1200, height: 600, crop: 'fill', quality: 'auto' },
};

export default cloudinary;