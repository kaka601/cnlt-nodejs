// Middleware logger
const loggerMiddleware = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
};

// Middleware kiểm tra đăng nhập
const requireLogin = (req, res, next) => {
    if (req.session && req.session.user) {
        next();
    } else {
        res.status(401).json({ error: "Unauthorized. Please login first." });
    }
};

// Middleware xử lý lỗi chung
const errorMiddleware = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal Server Error" });
};

module.exports = {
    loggerMiddleware,
    requireLogin,
    errorMiddleware
};
