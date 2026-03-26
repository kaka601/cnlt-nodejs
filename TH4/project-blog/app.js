const express = require('express');
const mongoose = require('mongoose');
const BlogPost = require('./models/BlogPost');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

mongoose.connect('mongodb://127.0.0.1:27017/blogDB')
  .then(() => console.log('✅ Kết nối MongoDB thành công'))
  .catch(err => console.log('❌ Lỗi MongoDB:', err));

// ==================== ROUTES ====================

// Trang chủ - Sắp xếp bài mới nhất lên trên
app.get('/', async (req, res) => {
  const posts = await BlogPost.find({}).sort({ createdAt: -1 });
  res.render('index', { posts });
});

// Tạo bài mới
app.get('/blogposts/new', (req, res) => {
  res.render('create');
});

app.post('/blogposts/store', async (req, res) => {
  await BlogPost.create({
    title: req.body.title,
    body: req.body.body
  });
  res.redirect('/');
});

// Xem chi tiết
app.get('/blogposts/:id', async (req, res) => {
  const post = await BlogPost.findById(req.params.id);
  res.render('detail', { post });
});

// ==================== SỬA BÀI VIẾT ====================
app.get('/blogposts/:id/edit', async (req, res) => {
  const post = await BlogPost.findById(req.params.id);
  res.render('edit', { post });
});

app.post('/blogposts/:id/update', async (req, res) => {
  await BlogPost.findByIdAndUpdate(req.params.id, {
    title: req.body.title,
    body: req.body.body
  });
  res.redirect('/');
});

// ==================== XÓA BÀI VIẾT ====================
app.post('/blogposts/:id/delete', async (req, res) => {
  await BlogPost.findByIdAndDelete(req.params.id);
  res.redirect('/');
});

app.listen(3000, () => {
  console.log('🚀 Server chạy tại http://localhost:3000');
});