const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);

// Thêm GET /login để hỗ trợ bạn test "chay" bằng link trên trình duyệt
router.get('/login', (req, res) => {
    req.body = { username: 'admin', password: '123456' }; // giả lập data gửi lên
    authController.login(req, res);
});

router.post('/logout', authController.logout);

module.exports = router;
