const { readData, writeData } = require('../models/studentModel');

// Lấy danh sách (hỗ trợ phân trang, tìm kiếm, lọc)
const getStudents = (req, res) => {
    let students = readData();
    students = students.filter(s => !s.isDeleted); // Soft delete: không lấy những hs đã xóa

    // Filter theo name, class
    if (req.query.name) {
        students = students.filter(s => s.name.toLowerCase().includes(req.query.name.toLowerCase()));
    }
    if (req.query.class) {
        students = students.filter(s => s.class.toLowerCase() === req.query.class.toLowerCase());
    }

    // Sort
    if (req.query.sort === 'age_desc') {
        students.sort((a, b) => b.age - a.age);
    } else if (req.query.sort === 'age_asc') {
        students.sort((a, b) => a.age - b.age);
    }

    // Pagination
    let total = students.length;
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    
    let startIndex = (page - 1) * limit;
    let endIndex = page * limit;

    let data = students.slice(startIndex, endIndex);

    res.json({
        page,
        limit,
        total,
        data
    });
};

// Lấy 1 sinh viên
const getStudentById = (req, res) => {
    const students = readData();
    const student = students.find(s => s.id === parseInt(req.params.id) && !s.isDeleted);
    
    if (!student) {
        return res.status(404).json({ error: "Student not found" });
    }
    res.json(student);
};

// Validation Helper
const validateStudent = (data, isUpdate = false, currentId = null) => {
    const { name, email, age, class: className } = data;
    let errors = [];

    if (name !== undefined) {
        if (name.length < 2) errors.push("Name must be at least 2 characters");
    } else if (!isUpdate) {
        errors.push("Name is required");
    }

    if (email !== undefined) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) errors.push("Invalid email format");
        
        const students = readData();
        const emailExists = students.some(s => s.email === email && (!isUpdate || s.id !== currentId));
        if (emailExists) errors.push("Email already exists");
    } else if (!isUpdate) {
        errors.push("Email is required");
    }

    if (age !== undefined) {
        if (age < 16 || age > 60) errors.push("Age must be between 16 and 60");
    } else if (!isUpdate) {
        errors.push("Age is required");
    }

    return errors;
};

// Thêm sinh viên
const createStudent = (req, res) => {
    const errors = validateStudent(req.body);
    if (errors.length > 0) return res.status(400).json({ errors });

    const students = readData();
    const newId = students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1;
    
    const newStudent = {
        id: newId,
        name: req.body.name,
        email: req.body.email,
        age: req.body.age,
        class: req.body.class || "",
        isDeleted: false
    };

    students.push(newStudent);
    writeData(students);

    res.status(201).json(newStudent);
};

// Sửa sinh viên
const updateStudent = (req, res) => {
    const id = parseInt(req.params.id);
    const students = readData();
    const studentIndex = students.findIndex(s => s.id === id && !s.isDeleted);

    if (studentIndex === -1) return res.status(404).json({ error: "Student not found" });

    const errors = validateStudent(req.body, true, id);
    if (errors.length > 0) return res.status(400).json({ errors });

    const updatedStudent = { ...students[studentIndex], ...req.body };
    students[studentIndex] = updatedStudent;
    writeData(students);

    res.json(updatedStudent);
};

// Xóa sinh viên (Soft Delete)
const deleteStudent = (req, res) => {
    const id = parseInt(req.params.id);
    const students = readData();
    const studentIndex = students.findIndex(s => s.id === id && !s.isDeleted);

    if (studentIndex === -1) return res.status(404).json({ error: "Student not found" });

    students[studentIndex].isDeleted = true;
    writeData(students);

    res.json({ message: "Student deleted successfully" });
};

// --- Phần Thống kê ---
const getStats = (req, res) => {
    const students = readData();
    const total = students.length;
    const active = students.filter(s => !s.isDeleted);
    const deleted = total - active.length;
    
    const totalAge = active.reduce((sum, s) => sum + s.age, 0);
    const averageAge = active.length > 0 ? (totalAge / active.length).toFixed(2) : 0;

    res.json({
        total,
        active: active.length,
        deleted,
        averageAge: parseFloat(averageAge)
    });
};

const getStatsByClass = (req, res) => {
    const students = readData();
    const active = students.filter(s => !s.isDeleted);
    
    const stats = {};
    active.forEach(s => {
        const c = s.class || "Unknown";
        stats[c] = (stats[c] || 0) + 1;
    });

    const result = Object.keys(stats).map(key => ({
        class: key,
        count: stats[key]
    }));

    res.json(result);
};

module.exports = {
    getStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent,
    getStats,
    getStatsByClass
};
