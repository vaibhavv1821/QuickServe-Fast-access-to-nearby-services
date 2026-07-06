const multer = require('multer');
const path = require('path');

const imageFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|gif/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) cb(null, true);
  else cb(new Error('Only image files allowed!'), false);
};

const createStorage = (folder) => {
  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
    try {
      const cloudinary = require('../config/cloudinary');
      const { CloudinaryStorage } = require('multer-storage-cloudinary');
      return new CloudinaryStorage({
        cloudinary,
        params: {
          folder: `quickserve/${folder}`,
          allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
          transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto' }],
        },
      });
    } catch (err) {
      console.warn('[Upload] Cloudinary fallback to memory:', err.message);
    }
  }
  return multer.memoryStorage();
};

const profileUpload = multer({
  storage: createStorage('profiles'),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: imageFilter,
});

const serviceUpload = multer({
  storage: createStorage('services'),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: imageFilter,
});

const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ success: false, message: 'File too large. Max 5MB.' });
    }
    return res.status(400).json({ success: false, message: err.message });
  }
  if (err) return res.status(400).json({ success: false, message: err.message });
  next();
};

module.exports = { profileUpload, serviceUpload, handleUploadError };
