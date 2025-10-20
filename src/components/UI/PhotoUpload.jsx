// FILE: src/components/UI/PhotoUpload.jsx
// PURPOSE: Photo upload component with Cloudinary integration

import React, { useState, useCallback } from 'react';
import { useChatContext } from '../../context/ChatContext';
import { usePhotoUpload } from '../../hooks/usePhotoUpload';
import { PHOTO_SUGGESTIONS } from '../../constants/messages';
import { CONFIG } from '../../constants/config';

const PhotoUpload = () => {
  const { chatState, updateChatData, addBotMessage } = useChatContext();
  const { uploading, uploadPhoto } = usePhotoUpload();
  const [previews, setPreviews] = useState([]);

  const category = chatState.data.photoCategory || chatState.serviceType;
  const suggestions = PHOTO_SUGGESTIONS[category] || PHOTO_SUGGESTIONS.moving;

  const handleFileSelect = useCallback(async (e) => {
    const files = Array.from(e.target.files);
    const remainingSlots = CONFIG.maxPhotos - (chatState.data.photos?.length || 0);

    if (remainingSlots <= 0) {
      addBotMessage(`<div class="photo-upload-error">
        You've reached the maximum of ${CONFIG.maxPhotos} photos. 
        Please remove some photos to add new ones.
      </div>`);
      return;
    }

    const filesToUpload = files.slice(0, remainingSlots);

    for (const file of filesToUpload) {
      if (!file.type.startsWith('image/')) {
        addBotMessage(`<div class="photo-upload-error">
          "${file.name}" is not a valid image file.
        </div>`);
        continue;
      }

      if (file.size > CONFIG.maxFileSize) {
        addBotMessage(`<div class="photo-upload-error">
          "${file.name}" is too large. Maximum file size is 10MB.
        </div>`);
        continue;
      }

      try {
        addBotMessage(`<div class="sending-indicator">
          <div class="spinner"></div>
          Uploading ${file.name}...
        </div>`);

        const photoData = await uploadPhoto(file, {
          customer: chatState.data.firstName || 'Unknown',
          serviceType: chatState.serviceType,
          category: category
        });

        const currentPhotos = chatState.data.photos || [];
        updateChatData({
          photos: [...currentPhotos, photoData],
          hasPhotos: true
        });

        addBotMessage(`<div class="photo-upload-success">
          ✅ Photo uploaded successfully!
        </div>`);
      } catch (error) {
        console.error('Upload error:', error);
        addBotMessage(`<div class="photo-upload-error">
          ❌ Failed to upload photo. You can try again or continue without photos.
        </div>`);
      }
    }
  }, [chatState.data.photos, chatState.serviceType, category, uploadPhoto, updateChatData, addBotMessage]);

  const removePhoto = useCallback((index) => {
    const newPhotos = [...(chatState.data.photos || [])];
    newPhotos.splice(index, 1);
    updateChatData({
      photos: newPhotos,
      hasPhotos: newPhotos.length > 0
    });
  }, [chatState.data.photos, updateChatData]);

  return (
    <div className="photo-upload-section">
      <div className="photo-upload-container">
        <div className="photo-upload-icon">📸</div>
        <div className="photo-upload-text">
          {/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
            ? 'Tap to take or select photos'
            : 'Click to upload photos'}
        </div>
        <label htmlFor="photo-upload-input" className="photo-upload-button">
          <span>📷</span> Add Photos
        </label>
        <input
          id="photo-upload-input"
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        <div className="photo-count-indicator">
          {chatState.data.photos?.length || 0}/{CONFIG.maxPhotos} photos
        </div>
      </div>

      {chatState.data.photos?.length > 0 && (
        <div className="photo-preview-container">
          {chatState.data.photos.map((photo, index) => (
            <div key={index} className="photo-preview-item">
              <img src={photo.url} alt={photo.filename} />
              <button
                className="remove-photo"
                onClick={() => removePhoto(index)}
                aria-label="Remove photo"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {(!chatState.data.photos || chatState.data.photos.length === 0) && (
        <div className="highlight-box" style={{ marginTop: '10px' }}>
          <strong>Suggested photos:</strong><br />
          {suggestions}
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;