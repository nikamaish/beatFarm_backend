const multer = require("multer");
const path = require("path");

// Define the storage for songs
const songStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/songs/'); // Directory where song files will be saved
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Use a unique filename
  }
});

// Upload song middleware with file type validation
const uploadSong = multer({
  storage: songStorage,
  limits: { fileSize: 20 * 1024 * 1024 }, // Limit file size to 20MB
  fileFilter: (req, file, cb) => {
    const fileTypes =/mp3|wav|mpeg|audio/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Error: Only audio files (MP3, WAV) are allowed!"));
    }
  }
}).single("song"); // Expecting the file field name to be 'song'

module.exports = uploadSong;
