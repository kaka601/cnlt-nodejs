const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlogPostSchema = new Schema({
  title: String,
  body: String,
  createdAt: { type: Date, default: Date.now }   // ← Thêm dòng này
});

const BlogPost = mongoose.model('BlogPost', BlogPostSchema);
module.exports = BlogPost;