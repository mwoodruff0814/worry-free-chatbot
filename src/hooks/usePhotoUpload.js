// FILE: src/hooks/usePhotoUpload.js
// PURPOSE: Handle photo uploads to Cloudinary

import { useState, useCallback } from 'react';
import { CONFIG } from '../constants/config';

export const usePhotoUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);

  const uploadPhoto = useCallback(async (file, metadata = {}) => {
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }

    if (file.size > CONFIG.maxFileSize) {
      throw new Error('File size exceeds 10MB limit');
    }

    setUploading(true);
    setUploadProgress(0);
    setUploadError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CONFIG.cloudinary.uploadPreset);
    formData.append('folder', `${CONFIG.cloudinary.folder}/${metadata.serviceType || 'general'}`);
    
    const uploadMetadata = {
      customer: metadata.customer || 'Unknown',
      service_type: metadata.serviceType || 'general',
      upload_source: 'worry_free_moving_chatbot',
      timestamp: new Date().toISOString()
    };
    formData.append('context', JSON.stringify(uploadMetadata));

    try {
      const response = await fetch(CONFIG.cloudinary.apiUrl, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();

      setUploadProgress(100);
      setUploading(false);

      return {
        url: data.secure_url,
        publicId: data.public_id,
        filename: file.name,
        uploadedAt: new Date().toISOString(),
        category: metadata.category || 'general'
      };
    } catch (error) {
      setUploadError(error.message);
      setUploading(false);
      throw error;
    }
  }, []);

  const uploadMultiplePhotos = useCallback(async (files, metadata = {}) => {
    const uploadPromises = Array.from(files).map(file => uploadPhoto(file, metadata));
    return Promise.all(uploadPromises);
  }, [uploadPhoto]);

  return {
    uploading,
    uploadProgress,
    uploadError,
    uploadPhoto,
    uploadMultiplePhotos
  };
};