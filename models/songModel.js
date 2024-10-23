const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Reference to the artist (user)
        required: true
    },
    filePath: {
        type: String,  // Path where the song file is stored
        required: true
    },
    uploadDate: {
        type: Date,
        default: Date.now
    },
    isApproved: {
        type: Boolean,
        default: false // By default, the song is unapproved
    },
    // Additional fields like album, duration, etc.
});

const Song = mongoose.model('Song', songSchema);
module.exports = Song;
