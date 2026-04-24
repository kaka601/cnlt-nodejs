const express = require('express');
const session = require('express-session');
const { loggerMiddleware, errorMiddleware } = require('./middlewares');

const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const demoRoutes = require('./routes/demoRoutes');

const app = express();
const PORT = 3000;

// Middlewares cấu hình
app.use(express.json());
app.use(session({
    secret: 'my-super-secret-key-123',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Đặt true nếu dùng HTTPS
}));

// Logger middleware
app.use(loggerMiddleware);

// Các Routes
app.use('/', authRoutes); // /login, /logout
app.use('/students', studentRoutes); // Quản lý sinh viên & Thống kê
app.use('/', demoRoutes); // /heavy-sync, /heavy-async

// Error handling middleware (nằm cuối cùng)
app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
