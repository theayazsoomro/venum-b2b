import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

// Configure multer for memory storage
const storage = multer.memoryStorage();
export const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Upload to Cloudinary with explicit configuration
export const uploadToCloudinary = async (buffer, filename) => {
  try {
    console.log('Attempting to upload to Cloudinary...'); // Debug log
    console.log('Cloudinary config check:', {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'Set' : 'Missing',
      api_key: process.env.CLOUDINARY_API_KEY ? 'Set' : 'Missing',
      api_secret: process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Missing'
    });
    
    // Explicitly configure cloudinary right before upload
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true
    });
    
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'venum-b2b',
          public_id: `product_${Date.now()}_${Math.random().toString(36).substring(2)}`,
          transformation: [
            { width: 800, height: 600, crop: "limit", quality: "auto:good" },
            { format: "webp" }
          ]
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error); // Debug log
            reject(error);
          } else {
            console.log('Cloudinary upload success:', result.secure_url); // Debug log
            resolve(result);
          }
        }
      ).end(buffer);
    });
    
    return result.secure_url;
  } catch (error) {
    console.error('Upload to Cloudinary failed:', error.message); // Better error logging
    throw new Error(`Image upload failed: ${error.message}`);
  }
};

// Delete from Cloudinary
export const deleteFromCloudinary = async (imageUrl) => {
  try {
    // Explicitly configure cloudinary for delete operation too
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true
    });
    
    // Extract public_id from Cloudinary URL
    const urlParts = imageUrl.split('/');
    const fileWithExt = urlParts[urlParts.length - 1];
    const publicId = `venum-b2b/${fileWithExt.split('.')[0]}`;
    
    console.log('Attempting to delete from Cloudinary:', publicId); // Debug log
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
  }
};