const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Probar la conexión
// cloudinary.api.ping((error, result) => {
//   if (error) {
//     console.error('Error connecting to Cloudinary:', error);
//   } else {
//     console.log('Connected to Cloudinary:', result);
//   }
// });

module.exports = cloudinary;