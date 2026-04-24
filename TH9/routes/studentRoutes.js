const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { requireLogin } = require('../middlewares');

// Các API thống kê cần nằm trước /:id
router.get('/stats', requireLogin, studentController.getStats);
router.get('/stats/class', requireLogin, studentController.getStatsByClass);

// CRUD
router.get('/', requireLogin, studentController.getStudents);
router.get('/:id', requireLogin, studentController.getStudentById);
router.post('/', requireLogin, studentController.createStudent);
router.put('/:id', requireLogin, studentController.updateStudent);
router.delete('/:id', requireLogin, studentController.deleteStudent);

module.exports = router;
