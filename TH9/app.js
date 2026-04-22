
const express = require('express');
const fs = require('fs');
const session = require('express-session');

const app = express();
const PORT = 3000;
const STUDENTS_FILE = './students.json';


app.use(express.json()); 
app.use(session({
    secret: 'it-quy-nhon-university-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 30 * 60 * 1000 }
}));


let students = [];


const loadData = () => {
    try {
        if (fs.existsSync(STUDENTS_FILE)) {
            const data = fs.readFileSync(STUDENTS_FILE, 'utf-8');
            students = JSON.parse(data);
        } else {
            // Nếu file không tồn tại, khởi tạo dữ liệu mẫu
            students = [
                { id: 1, name: "Nguyen Van A", email: "vana@example.com" },
                { id: 2, name: "Tran Thi B", email: "thib@example.com" }
            ];
            saveData();
        }
    } catch (err) {
        console.error("Lỗi khi đọc file students.json:", err.message);
        students = [];
    }
};

// Hàm lưu dữ liệu vào file mỗi khi có thay đổi
const saveData = () => {
    try {
        fs.writeFileSync(STUDENTS_FILE, JSON.stringify(students, null, 4));
    } catch (err) {
        console.error("Lỗi khi ghi file students.json:", err.message);
    }
};


loadData();


app.get('/', (req, res) => {
    res.json({
        message: "Chào mừng bạn đến với API Quản lý Sinh viên!",
        endpoints: {
            students: "/students",
            search: "/students/search?name=...",
            sync: "/sync",
            async: "/async",
            auth: ["/login", "/profile", "/logout"]
        }
    });
});

// ==========================================
// 4. BÀI 1 & 5: QUẢN LÝ SINH VIÊN & PHÂN TRANG
// ==========================================

// GET /students - Danh sách sinh viên (Hỗ trợ phân trang)
app.get('/students', (req, res) => {
    let { page, limit } = req.query;
    let result = [...students];

    if (page && limit) {
        const p = parseInt(page) || 1;
        const l = parseInt(limit) || 2;
        const start = (p - 1) * l;
        const end = p * l;
        result = result.slice(start, end);
    }

    res.status(200).json(result);
});


app.get('/students/search', (req, res) => {
    const { name } = req.query;
    if (!name) return res.status(400).json({ msg: "Vui lòng cung cấp tham số 'name' để tìm kiếm." });
    
    const result = students.filter(s => s.name.toLowerCase().includes(name.toLowerCase()));
    res.json(result);
});


app.get('/students/:id', (req, res) => {
    const student = students.find(s => s.id == req.params.id);
    if (!student) return res.status(404).json({ msg: "Không tìm thấy sinh viên với ID này." });
    res.json(student);
});


app.post('/students', (req, res) => {
    const { name, email } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validation logic
    if (!name || name.trim().length < 2) 
        return res.status(400).json({ msg: "Tên không được để trống và phải có ít nhất 2 ký tự." });
    if (!email || !emailRegex.test(email)) 
        return res.status(400).json({ msg: "Email không đúng định dạng (VD: example@mail.com)." });
    if (students.find(s => s.email === email)) 
        return res.status(400).json({ msg: "Email này đã tồn tại trong hệ thống." });

    const newStudent = { 
        id: students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1, 
        name: name.trim(), 
        email: email.trim() 
    };

    students.push(newStudent);
    saveData();
    res.status(201).json(newStudent);
});


app.put('/students/:id', (req, res) => {
    const index = students.findIndex(s => s.id == req.params.id);
    if (index === -1) return res.status(404).json({ msg: "Không tìm thấy sinh viên để cập nhật." });
    
    const { name, email } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (name && name.trim().length < 2) 
        return res.status(400).json({ msg: "Tên mới phải có ít nhất 2 ký tự." });
    if (email) {
        if (!emailRegex.test(email)) return res.status(400).json({ msg: "Email mới không hợp lệ." });
        if (students.find(s => s.email === email && s.id != req.params.id)) 
            return res.status(400).json({ msg: "Email mới đã được sử dụng bởi sinh viên khác." });
    }

    students[index] = { ...students[index], ...req.body };
    saveData();
    res.json({ msg: "Cập nhật thành công!", student: students[index] });
});


app.delete('/students/:id', (req, res) => {
    const initialCount = students.length;
    students = students.filter(s => s.id != req.params.id);
    
    if (students.length === initialCount) {
        return res.status(404).json({ msg: "Không tìm thấy sinh viên để xóa." });
    }
    
    saveData();
    res.json({ msg: "Đã xóa sinh viên thành công." });
});


app.get('/sync', (req, res) => {
    console.log("[SYNC] Bắt đầu đọc file...");
    const data = fs.readFileSync(STUDENTS_FILE, 'utf8'); // Chặn luồng cho đến khi đọc xong
    console.log("[SYNC] Nội dung đã đọc xong.");
    res.json({ 
        mode: "Blocking (Sync)", 
        msg: "Kiểm tra Console log để thấy cơ chế Blocking.",
        data: JSON.parse(data)
    });
});


app.get('/async', (req, res) => {
    console.log("[ASYNC] Bắt đầu gửi yêu cầu đọc file...");
    fs.readFile(STUDENTS_FILE, 'utf8', (err, data) => {
        if (err) return console.error(err);
        console.log("[ASYNC] Đã đọc xong file trong callback.");
    });
    console.log("[ASYNC] Tiếp tục thực hiện các lệnh khác mà không cần đợi file.");
    res.json({ 
        mode: "Non-blocking (Async)", 
        msg: "Kiểm tra Console log để thấy cơ chế Non-blocking."
    });
});


app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    
    if (username === 'admin' && password === '123456') {
        req.session.user = { username: 'admin', fullName: 'Quản trị viên' };
        res.json({ msg: "Đăng nhập thành công! Chào mừng Admin." });
    } else {
        res.status(400).json({ msg: "Tài khoản hoặc mật khẩu không chính xác." });
    }
});


app.get('/profile', (req, res) => {
    if (req.session.user) {
        res.json({ 
            msg: "Thông tin phiên đăng nhập hiện tại", 
            user: req.session.user 
        });
    } else {
        res.status(401).json({ msg: "Bạn chưa đăng nhập. Vui lòng truy cập /login trước." });
    }
});


app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ msg: "Không thể đăng xuất." });
        res.json({ msg: "Đã đăng xuất và hủy phiên làm việc." });
    });
});


app.listen(PORT, () => {
    console.log("--------------------------------------------------");
    console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
    console.log(`👉 API Sinh viên: http://localhost:${PORT}/students`);
    console.log("--------------------------------------------------");
});