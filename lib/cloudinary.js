const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function uploadToCloudinary(filePath) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      filePath,
      (options = { folder: 'ctrip' }),
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
  });
}
exports.uploadToCloudinary = uploadToCloudinary;
