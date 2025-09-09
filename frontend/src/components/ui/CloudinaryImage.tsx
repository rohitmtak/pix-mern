import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface CloudinaryImageProps {
  cloudinaryUrl: string; // Use full Cloudinary URL instead of publicId
  alt: string;
  className?: string; // Backwards-compatible: applied to both container and img if specific classes not provided
  containerClassName?: string; // New: classes for the outer container wrapper
  imgClassName?: string; // New: classes for the actual <img>
  width?: number | string;
  height?: number | string;
  quality?: 'auto' | 'best' | 'good' | 'eco' | 'low' | number;
  format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
  crop?: 'scale' | 'fit' | 'fill' | 'crop' | 'thumb';
  gravity?: 'auto' | 'face' | 'center' | 'north' | 'south' | 'east' | 'west';
  loading?: 'lazy' | 'eager';
  placeholder?: 'blur' | 'pixelate' | 'vectorize';
  blur?: number;
  fetchFormat?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
  responsive?: boolean;
  sizes?: string;
  srcSet?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const CloudinaryImage: React.FC<CloudinaryImageProps> = ({
  cloudinaryUrl,
  alt,
  className,
  containerClassName,
  imgClassName,
  width,
  height,
  quality = 'auto',
  format = 'auto',
  crop = 'scale',
  gravity = 'auto',
  loading = 'lazy',
  placeholder = 'blur',
  blur = 1000,
  fetchFormat = 'auto',
  responsive = true,
  sizes,
  srcSet,
  onLoad,
  onError,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Extract the base URL and add transformations
  const getOptimizedUrl = (transformations: Record<string, any>) => {
    // For URLs with version numbers, we need to handle them differently
    const urlParts = cloudinaryUrl.split('/upload/');
    const baseUrl = urlParts[0] + '/upload/';
    const pathAfterUpload = urlParts[1];
    
    // Check if URL has version number (starts with 'v' followed by digits)
    const versionMatch = pathAfterUpload.match(/^(v\d+)\/(.+)$/);
    
    if (versionMatch) {
      // URL has version: v1757268364/signature-collection-main_vpg5ft.webp
      const version = versionMatch[1];
      const publicId = versionMatch[2];
      
      const transformString = Object.entries(transformations)
        .filter(([_, value]) => value !== undefined && value !== null)
        .map(([key, value]) => `${key}_${value}`)
        .join(',');
      
      return transformString 
        ? `${baseUrl}${transformString}/${version}/${publicId}`
        : cloudinaryUrl;
    } else {
      // URL doesn't have version, treat as normal
      const transformString = Object.entries(transformations)
        .filter(([_, value]) => value !== undefined && value !== null)
        .map(([key, value]) => `${key}_${value}`)
        .join(',');
      
      return transformString 
        ? `${baseUrl}${transformString}/${pathAfterUpload}`
        : cloudinaryUrl;
    }
  };

  // For now, disable responsive srcSet to avoid transformation issues
  const generateSrcSet = () => {
    return undefined; // Disable for now
  };

  // For now, use the URL directly without transformations
  // Cloudinary URLs are already optimized
  const imageUrl = cloudinaryUrl;
  const placeholderUrl = cloudinaryUrl; // Use same URL for placeholder

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  if (hasError) {
    return (
      <div 
        className={cn(
          "bg-gray-200 flex items-center justify-center text-gray-500",
          containerClassName || className
        )}
        style={{ width, height }}
      >
        <span className="text-sm">Image failed to load</span>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", containerClassName || className)}>
      {/* Placeholder */}
      {!isLoaded && (
        <img
          src={placeholderUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-sm"
          style={{ width, height }}
        />
      )}
      
      {/* Main Image */}
      <img
        src={imageUrl}
        srcSet={srcSet || generateSrcSet()}
        sizes={sizes || "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"}
        alt={alt}
        className={cn(
          // Ensure the image can fill its container by default
          "w-full h-full object-cover transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0",
          // Allow caller to override image-specific classes
          imgClassName || className
        )}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        style={{ width, height }}
      />
    </div>
  );
};

export default CloudinaryImage;
