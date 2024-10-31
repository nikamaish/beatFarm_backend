const mongoose = require("mongoose");

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
    ref: "User",
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
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"], // Three possible statuses
    default: "pending", // Default to pending
  },
  rejectedReason: {
    type: String,
    default: null, // Optional field for rejection reason
  },
});

const Song = mongoose.model("Song", songSchema);
module.exports = Song;
