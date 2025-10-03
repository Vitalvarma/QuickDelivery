// utils/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Create storage engine for Multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'delivery-app',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto' }]
  }
});

const parser = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Middleware to handle errors from multer
const uploadDeliveryImage = (req, res, next) => {
  parser.single('imageUrl')(req, res, (err) => {
    if (err) {
      console.error('Error uploading image:', err);
      return res.status(400).json({ message: 'Image upload failed', error: err.message });
    }
    next();
  });
};

export { cloudinary, uploadDeliveryImage };
