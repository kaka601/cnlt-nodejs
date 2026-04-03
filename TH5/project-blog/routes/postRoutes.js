const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const upload = require('../middleware/upload');

router.get('/', postController.getAllPosts);
router.get('/new', postController.getNewPostForm);
router.post('/', upload.single('image'), postController.createPost);

router.get('/:id', postController.getPostById);
router.get('/:id/edit', postController.getEditPostForm);
router.put('/:id', upload.single('image'), postController.updatePost);
router.delete('/:id', postController.deletePost);

router.post('/:id/comments', postController.addComment);

module.exports = router;