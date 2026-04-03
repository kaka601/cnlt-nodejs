const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

router.get('/', postController.getAllPosts);
router.get('/new', postController.getNewPostForm);
router.post('/', postController.createPost);

router.get('/:id', postController.getPostById);
router.get('/:id/edit', postController.getEditPostForm);
router.put('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);

module.exports = router;