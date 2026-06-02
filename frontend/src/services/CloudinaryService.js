import axios from 'axios';

const cloudName = 'dgf9sqcdy';
const baseURL = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
// Replace this with your actual unsigned upload preset name from Cloudinary
const UPLOAD_PRESET = 'SheIsDesign'; 

export const cloudinaryService = {
  /**
   * @param {File|Blob} file - The image file to upload
   * @param {string} [folderName='uploads'] - Optional folder name
   * @returns {Promise<string|null>} The secure URL link of the image, or null if it fails.
   */
  async uploadImage(file, folderName = 'uploads') {
    if (!file) {
      console.error('Cloudinary Service: No file provided for upload.');
      return null;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', folderName);

    try {
      const response = await axios.post(baseURL, formData);

      return response.data.secure_url;

    } catch (error) {
      if (error.response) {
        console.error('Cloudinary Upload Failed:', error.response.data.error?.message || error.response.data);
      } else {
        console.error('Cloudinary Service Network Error:', error.message);
      }
      return null;
    }
  }
};