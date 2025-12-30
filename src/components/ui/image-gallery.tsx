import React, { useState } from 'react';
import { X, ZoomIn, Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getTransformedImageUrl, imageTransformations } from '@/lib/cloudinary';

interface ImageItem {
  id: string;
  publicId: string;
  url: string;
  title?: string;
  description?: string;
  tags?: string[];
  createdAt?: string;
}

interface ImageGalleryProps {
  images: ImageItem[];
  onRemove?: (id: string, publicId: string) => void;
  className?: string;
  columns?: 2 | 3 | 4;
  showTags?: boolean;
  showActions?: boolean;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  onRemove,
  className,
  columns = 3,
  showTags = true,
  showActions = true,
}) => {
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);

  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  const handleImageClick = (image: ImageItem) => {
    setSelectedImage(image);
  };

  const handleRemove = (e: React.MouseEvent, image: ImageItem) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove(image.id, image.publicId);
    }
  };

  const handleDownload = (image: ImageItem) => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = image.title || `image-${image.id}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (images.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No images uploaded yet</p>
      </div>
    );
  }

  return (
    <>
      <div className={cn('grid gap-4', gridCols[columns], className)}>
        {images.map((image) => (
          <div
            key={image.id}
            className="group relative bg-card rounded-lg overflow-hidden border hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleImageClick(image)}
          >
            <div className="aspect-square relative overflow-hidden">
              <img
                src={getTransformedImageUrl(image.publicId, imageTransformations.medium)}
                alt={image.title || 'Gallery image'}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              
              {/* Actions */}
              {showActions && (
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity space-x-1">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleImageClick(image);
                    }}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  {onRemove && (
                    <Button
                      size="sm"
                      variant="destructive"
                      className="h-8 w-8 p-0"
                      onClick={(e) => handleRemove(e, image)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Image Info */}
            {(image.title || image.tags) && (
              <div className="p-3 space-y-2">
                {image.title && (
                  <h4 className="font-medium text-sm truncate">{image.title}</h4>
                )}
                {showTags && image.tags && image.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {image.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {image.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{image.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Image Preview Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          {selectedImage && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>{selectedImage.title || 'Image Preview'}</span>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownload(selectedImage)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(selectedImage.url, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open
                    </Button>
                  </div>
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={getTransformedImageUrl(selectedImage.publicId, imageTransformations.large)}
                    alt={selectedImage.title || 'Preview'}
                    className="w-full max-h-96 object-contain rounded-lg"
                  />
                </div>
                
                {selectedImage.description && (
                  <p className="text-sm text-muted-foreground">
                    {selectedImage.description}
                  </p>
                )}
                
                {selectedImage.tags && selectedImage.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedImage.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                
                {selectedImage.createdAt && (
                  <p className="text-xs text-muted-foreground">
                    Uploaded: {new Date(selectedImage.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};