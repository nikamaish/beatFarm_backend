const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    uploadDate: {
      type: Date,
      default: Date.now,
    },
    isApproved: {
      type: Boolean,
      default: false, // By default, songs are not approved
    },
  });
  
const Song = mongoose.model('Song', songSchema);
module.exports = Song;
