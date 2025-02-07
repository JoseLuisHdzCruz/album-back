const mongoose = require('mongoose');

const AlbumSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  categoria: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  publicId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Album', AlbumSchema);