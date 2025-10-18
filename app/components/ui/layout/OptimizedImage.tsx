'use client';

import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, X, Download, RotateCw } from 'lucide-react';
import { cn } from '@/app/lib/core/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  quality?: number;
  sizes?: string;
  blurDataURL?: string;
  lazy?: boolean;
  zoomable?: boolean;
  downloadable?: boolean;
  showLoadingIndicator?: boolean;
  errorFallback?: React.ReactNode;
  onLoad?: () => void;
  onError?: () => void;
}

const OptimizedImage = ({
  src,
  alt,
  width = 800,
  height = 600,
  className,
  priority = false,
  fill = false,
  quality = 85,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  blurDataURL,
  lazy = true,
  zoomable = false,
  downloadable = false,
  showLoadingIndicator = true,
  errorFallback,
  onLoad,
  onError,
}: OptimizedImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [imageRotation, setImageRotation] = useState(0);
  const [imageScale, setImageScale] = useState(1);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  // Generate a simple blur placeholder if none provided
  const defaultBlurDataURL = `data:image/svg+xml;base64,${Buffer.from(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#f3f4f6"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af" font-size="14">
        Loading...
      </text>
    </svg>`
  ).toString('base64')}`;

  const _errorPlaceholder = `data:image/svg+xml;base64,${Buffer.from(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#fee2e2"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#dc2626" font-size="14">
        Image unavailable
      </text>
    </svg>`
  ).toString('base64')}`;

  // Handle image load
  const handleImageLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  // Handle image error
  const handleImageError = () => {
    setHasError(true);
    setIsLoading(false);
    onError?.();
  };

  // Handle download
  const handleDownload = async () => {
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = alt || 'image';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Latausvirhe:', error);
    }
  };

  // Reset lightbox state
  const resetLightbox = useCallback(() => {
    setImageRotation(0);
    setImageScale(1);
    setImagePosition({ x: 0, y: 0 });
  }, []);

  // Close lightbox
  const closeLightbox = () => {
    setIsLightboxOpen(false);
    resetLightbox();
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isLightboxOpen) {
        setIsLightboxOpen(false);
        resetLightbox();
      }
    };

    if (isLightboxOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isLightboxOpen, resetLightbox]);

  if (hasError) {
    if (errorFallback) {
      return <div className={className}>{errorFallback}</div>;
    }

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={cn(
          "flex flex-col items-center justify-center bg-red-50 border-2 border-red-200 rounded-lg p-4 text-red-600",
          className
        )}
      >
        <div className="text-center">
          <div className="text-lg mb-2">📷</div>
          <p className="text-sm font-medium">Kuva ei saatavilla</p>
          <p className="text-xs text-red-500 mt-1">Tarkista kuvan osoite</p>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <div className={cn("relative overflow-hidden group", className)}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Image
            src={src}
            alt={alt}
            width={fill ? undefined : width}
            height={fill ? undefined : height}
            fill={fill}
            priority={priority || !lazy}
            quality={quality}
            sizes={sizes}
            placeholder="blur"
            blurDataURL={blurDataURL || defaultBlurDataURL}
            loading={lazy ? 'lazy' : 'eager'}
            className={cn(
              "duration-700 ease-in-out object-cover transition-all",
              isLoading ? "scale-105 blur-sm" : "scale-100 blur-0",
              zoomable && "cursor-zoom-in hover:scale-105"
            )}
            onLoad={handleImageLoad}
            onError={handleImageError}
            onClick={zoomable ? () => setIsLightboxOpen(true) : undefined}
            style={{
              objectFit: 'cover',
              transition: 'filter 0.3s ease-in-out, transform 0.3s ease-in-out',
            }}
          />
        </motion.div>

        {/* Loading Indicator */}
        {isLoading && showLoadingIndicator && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-slate-100"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="h-8 w-8 border-2 border-purple-200 border-t-purple-600 rounded-full mx-auto mb-2"
              />
              <p className="text-sm text-slate-600">Ladataan kuvaa...</p>
            </div>
          </motion.div>
        )}

        {/* Hover Controls */}
        {!isLoading && !hasError && (zoomable || downloadable) && (
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute inset-0 bg-black/30 flex items-center justify-center gap-2 opacity-0 transition-opacity"
          >
            {zoomable && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsLightboxOpen(true)}
                className="p-2 bg-white/90 rounded-full text-slate-700 hover:bg-white transition-colors"
                aria-label="Suurenna kuva"
              >
                <ZoomIn className="h-5 w-5" />
              </motion.button>
            )}
            {downloadable && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleDownload}
                className="p-2 bg-white/90 rounded-full text-slate-700 hover:bg-white transition-colors"
                aria-label="Lataa kuva"
              >
                <Download className="h-5 w-5" />
              </motion.button>
            )}
          </motion.div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            {/* Controls */}
            <div className="absolute top-4 right-4 flex gap-2 z-10">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setImageRotation(prev => prev + 90);
                }}
                className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                aria-label="Kierrä kuvaa"
              >
                <RotateCw className="h-5 w-5" />
              </motion.button>
              {downloadable && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload();
                  }}
                  className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                  aria-label="Lataa kuva"
                >
                  <Download className="h-5 w-5" />
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={closeLightbox}
                className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                aria-label="Sulje"
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>

            {/* Zoom Controls */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setImageScale(prev => Math.max(0.5, prev - 0.25));
                }}
                className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded text-white hover:bg-white/30 transition-colors"
              >
                -
              </motion.button>
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded text-white text-sm">
                {Math.round(imageScale * 100)}%
              </span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setImageScale(prev => Math.min(3, prev + 0.25));
                }}
                className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded text-white hover:bg-white/30 transition-colors"
              >
                +
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  resetLightbox();
                }}
                className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded text-white hover:bg-white/30 transition-colors"
              >
                Nollaa
              </motion.button>
            </div>

            {/* Image */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="relative max-w-full max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                drag
                dragConstraints={{ left: -200, right: 200, top: -200, bottom: 200 }}
                animate={{
                  scale: imageScale,
                  rotate: imageRotation,
                  x: imagePosition.x,
                  y: imagePosition.y,
                }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                className={cn(
                  "relative cursor-move",
                  isDragging && "cursor-grabbing"
                )}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={() => setIsDragging(false)}
              >
                <Image
                  src={src}
                  alt={alt}
                  width={800}
                  height={600}
                  className="max-w-full max-h-[80vh] object-contain"
                  quality={90}
                  priority
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default OptimizedImage;