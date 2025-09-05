// Cloudinary Direct Upload Utility
import axios from 'axios';

// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = 'djhnxxllr'; // Your cloud name
const CLOUDINARY_UPLOAD_PRESET = 'pix_videos'; // Change this to your preset name

/**
 * Upload video directly to Cloudinary
 * @param {File} videoFile - The video file to upload
 * @param {string} folder - Folder name in Cloudinary (e.g., 'product-videos')
 * @returns {Promise<Object>} - Cloudinary response with video URL
 */
export const uploadVideoToCloudinary = async (videoFile, folder = 'product-videos') => {
  try {
    // Create FormData for Cloudinary
    const formData = new FormData();
    formData.append('file', videoFile);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', folder);
    formData.append('resource_type', 'video');
    
    // Cloudinary optimization settings
    formData.append('quality', 'auto:best');
    formData.append('fetch_format', 'auto');
    formData.append('video_codec', 'auto');
    formData.append('audio_codec', 'aac');
    formData.append('crop', 'scale');
    
    // Upload directly to Cloudinary
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 300000, // 5 minutes timeout
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Cloudinary upload progress: ${percentCompleted}%`);
          
          // Show progress for large files
          if (progressEvent.total > 10 * 1024 * 1024) { // Files larger than 10MB
            const uploadedMB = Math.round(progressEvent.loaded / (1024 * 1024));
            const totalMB = Math.round(progressEvent.total / (1024 * 1024));
            console.log(`Cloudinary upload: ${uploadedMB}MB / ${totalMB}MB (${percentCompleted}%)`);
          }
        }
      }
    );

    if (response.data && response.data.secure_url) {
      console.log('✅ Video uploaded to Cloudinary:', response.data.secure_url);
      return {
        success: true,
        url: response.data.secure_url,
        publicId: response.data.public_id,
        duration: response.data.duration,
        size: response.data.bytes
      };
    } else {
      throw new Error('Invalid response from Cloudinary');
    }
      } catch (error) {
        console.error('❌ Cloudinary upload error:', error);
        
        if (error.code === 'ECONNABORTED') {
            throw new Error('Upload timeout. Please try with a smaller video file.');
        } else if (error.response?.status === 400) {
            // Check if it's a preset issue
            if (error.response?.data?.error?.message?.includes('preset')) {
                throw new Error('Cloudinary upload preset not found. Please create an unsigned upload preset named "pix_videos" in your Cloudinary dashboard.');
            } else {
                throw new Error('Invalid video format. Please use MP4, WebM, or MOV.');
            }
        } else if (error.response?.status === 413) {
            throw new Error('Video file too large. Please use a file smaller than 100MB.');
        } else {
            throw new Error(error.message || 'Failed to upload video to Cloudinary');
        }
    }
};

/**
 * Upload image to Cloudinary (for consistency)
 * @param {File} imageFile - The image file to upload
 * @param {string} folder - Folder name in Cloudinary
 * @returns {Promise<Object>} - Cloudinary response with image URL
 */
export const uploadImageToCloudinary = async (imageFile, folder = 'product-images') => {
  try {
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', folder);
    
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000, // 1 minute timeout for images
      }
    );

    if (response.data && response.data.secure_url) {
      return {
        success: true,
        url: response.data.secure_url,
        publicId: response.data.public_id
      };
    } else {
      throw new Error('Invalid response from Cloudinary');
    }
  } catch (error) {
    console.error('❌ Cloudinary image upload error:', error);
    throw new Error(error.message || 'Failed to upload image to Cloudinary');
  }
};
