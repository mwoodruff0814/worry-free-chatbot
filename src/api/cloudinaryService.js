// FILE: src/api/cloudinaryService.js
// PURPOSE: Cloudinary photo upload service

import { CONFIG } from '../constants/config';

class CloudinaryService {
  constructor() {
    this.cloudName = CONFIG.cloudinary.cloudName;
    this.uploadPreset = CONFIG.cloudinary.uploadPreset;
    this.apiUrl = CONFIG.cloudinary.apiUrl;
  }

  async uploadPhoto(file, onProgress) {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', this.uploadPreset);
      formData.append('folder', CONFIG.cloudinary.folder);

      const xhr = new XMLHttpRequest();
      
      if (onProgress) {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100;
            onProgress(percentComplete);
          }
        });
      }

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          console.log('Photo uploaded:', response.secure_url);
          resolve({
            url: response.secure_url,
            publicId: response.public_id
          });
        } else {
          reject(new Error('Upload failed'));
        }
      });

      xhr.addEventListener('error', () => reject(new Error('Upload failed')));
      xhr.open('POST', this.apiUrl);
      xhr.send(formData);
    });
  }

  async uploadPhotos(files, onProgressUpdate) {
    const uploads = [];
    for (let i = 0; i < files.length; i++) {
      const result = await this.uploadPhoto(files[i], (progress) => {
        if (onProgressUpdate) onProgressUpdate(i, progress);
      });
      uploads.push(result);
    }
    return uploads;
  }

  validateFile(file) {
    const maxSize = CONFIG.maxFileSize || 10485760;
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Invalid file type' };
    }
    if (file.size > maxSize) {
      return { valid: false, error: 'File too large' };
    }
    return { valid: true };
  }
}

export const cloudinaryService = new CloudinaryService();
