const express = require('express');
const connectDB = require('./config/db');
const postRoutes = require('./routes/postRoutes');
const methodOverride = require('method-override');

const app = express();
const PORT = 3000;

// Kết nối DB
connectDB();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));

// Routes
app.use('/', postRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});