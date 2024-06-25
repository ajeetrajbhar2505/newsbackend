const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newsSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Politics', 'Sports', 'Technology', 'Health', 'Entertainment', 'Business', 'World', 'Science']
  },
  tags: [{
    type: String,
    trim: true
  }],
  publishedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  },
  imageUrl: {
    type: String,
    trim: true
  },
  sourceUrl: {
    type: String,
    trim: true
  },
  views: {
    type: Number,
    default: 0
  },
  comments: [{
    user: {
      type: String,
      required: true
    },
    comment: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

const News = mongoose.model('News', newsSchema);

module.exports = News;
