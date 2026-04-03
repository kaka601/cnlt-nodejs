const BlogPost = require('../models/BlogPost');

exports.getAllPosts = async (req, res) => {
  const posts = await BlogPost.find().sort({ createdAt: -1 });
  res.render('index', { posts });
};

exports.getNewPostForm = (req, res) => {
  res.render('create');
};

exports.createPost = async (req, res) => {
  const { title, content, author } = req.body;
  await new BlogPost({ title, content, author }).save();
  res.redirect('/');
};

exports.getPostById = async (req, res) => {
  const post = await BlogPost.findById(req.params.id);
  if (!post) return res.status(404).send('Bài viết không tồn tại');
  res.render('detail', { post });
};

exports.getEditPostForm = async (req, res) => {
  const post = await BlogPost.findById(req.params.id);
  if (!post) return res.status(404).send('Bài viết không tồn tại');
  res.render('edit', { post });
};

exports.updatePost = async (req, res) => {
  const { title, content, author } = req.body;
  await BlogPost.findByIdAndUpdate(req.params.id, { title, content, author });
  res.redirect('/');
};

exports.deletePost = async (req, res) => {
  await BlogPost.findByIdAndDelete(req.params.id);
  res.redirect('/');
};