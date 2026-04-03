const BlogPost = require('../models/BlogPost');

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await BlogPost.find().sort({ createdAt: -1 });
    res.render('index', { posts });
  } catch (error) {
    res.status(500).send('Lỗi máy chủ');
  }
};

exports.getNewPostForm = (req, res) => {
  res.render('create');
};

exports.createPost = async (req, res) => {
  try {
    const { title, content, author } = req.body;
    await new BlogPost({ title, content, author }).save();
    res.redirect('/');
  } catch (error) {
    res.status(500).send('Lỗi khi tạo bài viết');
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).send('Bài viết không tồn tại');
    res.render('detail', { post });
  } catch (error) {
    if (error.name === 'CastError') return res.status(404).send('Bài viết không tồn tại');
    res.status(500).send('Lỗi máy chủ');
  }
};

exports.getEditPostForm = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).send('Bài viết không tồn tại');
    res.render('edit', { post });
  } catch (error) {
    if (error.name === 'CastError') return res.status(404).send('Bài viết không tồn tại');
    res.status(500).send('Lỗi máy chủ');
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { title, content, author } = req.body;
    await BlogPost.findByIdAndUpdate(req.params.id, { title, content, author });
    res.redirect('/');
  } catch (error) {
    if (error.name === 'CastError') return res.status(404).send('Bài viết không tồn tại');
    res.status(500).send('Lỗi máy chủ');
  }
};

exports.deletePost = async (req, res) => {
  try {
    await BlogPost.findByIdAndDelete(req.params.id);
    res.redirect('/');
  } catch (error) {
    if (error.name === 'CastError') return res.status(404).send('Bài viết không tồn tại');
    res.status(500).send('Lỗi máy chủ');
  }
};