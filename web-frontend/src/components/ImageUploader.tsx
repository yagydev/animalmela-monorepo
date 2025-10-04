'use client';

import React, { useState, useRef, useCallback } from 'react';
import { CloudArrowUpIcon, XMarkIcon, EyeIcon, TrashIcon } from '@heroicons/react/24/outline';
// import Image from 'next/image';

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  uploaded?: boolean;
  url?: string;
}

interface ImageUploaderProps {
  images: ImageFile[];
  onImagesChange: (images: ImageFile[]) => void;
  maxImages?: number;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  className?: string;
}

export default function ImageUploader({
  images,
  onImagesChange,
  maxImages = 5,
  maxSize = 5,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  className = ''
}: ImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `File type ${file.type} is not supported. Please use ${acceptedTypes.join(', ')}.`;
    }
    if (file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB.`;
    }
    return null;
  }, [acceptedTypes, maxSize]);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;

    const newImages: ImageFile[] = [];
    const errors: string[] = [];

    Array.from(files).forEach((file) => {
      if (images.length + newImages.length >= maxImages) {
        errors.push(`Maximum ${maxImages} images allowed.`);
        return;
      }

      const error = validateFile(file);
      if (error) {
        errors.push(error);
        return;
      }

      const imageFile: ImageFile = {
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview: URL.createObjectURL(file)
      };

      newImages.push(imageFile);
    });

    if (errors.length > 0) {
      alert(errors.join('\n'));
    }

    if (newImages.length > 0) {
      onImagesChange([...images, ...newImages]);
    }
  }, [images, maxImages, validateFile, onImagesChange]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  }, [handleFiles]);

  const removeImage = useCallback((id: string) => {
    const imageToRemove = images.find(img => img.id === id);
    if (imageToRemove) {
      URL.revokeObjectURL(imageToRemove.preview);
    }
    onImagesChange(images.filter(img => img.id !== id));
  }, [images, onImagesChange]);

  const uploadImages = useCallback(async () => {
    if (images.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = images.map(async (imageFile) => {
        if (imageFile.uploaded) return imageFile;

        const formData = new FormData();
        formData.append('image', imageFile.file);
        formData.append('type', 'farmer');

        // Simulate upload - replace with actual API call
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const result = await response.json();
        return {
          ...imageFile,
          uploaded: true,
          url: result.url
        };
      });

      const uploadedImages = await Promise.all(uploadPromises);
      onImagesChange(uploadedImages);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload images. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [images, onImagesChange]);

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${dragActive 
            ? 'border-green-400 bg-green-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${images.length >= maxImages ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={images.length >= maxImages ? undefined : openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileInput}
          className="hidden"
          disabled={images.length >= maxImages}
        />
        
        <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
        <div className="mt-2">
          <p className="text-sm text-gray-600">
            {images.length >= maxImages ? (
              `Maximum ${maxImages} images reached`
            ) : (
              <>
                <span className="font-medium text-green-600">Click to upload</span> or drag and drop
              </>
            )}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            PNG, JPG, WEBP up to {maxSize}MB each
          </p>
        </div>
      </div>

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">
              Images ({images.length}/{maxImages})
            </h4>
            <button
              onClick={uploadImages}
              disabled={uploading || images.every(img => img.uploaded)}
              className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Uploading...' : 'Upload All'}
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((image) => (
              <div key={image.id} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={image.url || image.preview}
                    alt="Preview"
                    className="w-full h-full object-cover cursor-zoom-in"
                    style={{ cursor: 'zoom-in' }}
                  />
                </div>
                
                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 flex space-x-1 transition-opacity duration-200">
                    <button
                      onClick={() => window.open(image.url || image.preview, '_blank')}
                      className="p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-50"
                      title="View full size"
                    >
                      <EyeIcon className="h-4 w-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => removeImage(image.id)}
                      className="p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-50"
                      title="Remove image"
                    >
                      <TrashIcon className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </div>

                {/* Upload Status */}
                {image.uploaded && (
                  <div className="absolute top-1 right-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
