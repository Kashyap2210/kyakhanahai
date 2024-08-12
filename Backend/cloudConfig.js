const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.VITE_APP_CLOUD_NAME,
  api_key: process.env.VITE_APP_CLOUD_API_KEY,
  api_secret: process.env.VITE_APP_CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "kyakhanahai_DEV",
    allowedFormats: ["png", "jpg", "jpeg"], // supports promises as well
  },
});

module.exports = {
  cloudinary,
  storage,
};
