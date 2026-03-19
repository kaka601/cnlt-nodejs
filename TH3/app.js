const express = require('express');
const path = require('path');
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));

// ==================== DỮ LIỆU + ẢNH (đã thêm image) ====================
const items = [
    { 
        id: 1, 
        name: 'Đà Lạt', 
        desc: 'Thành phố sương mù', 
        price: '1.5tr', 
        hot: true, 
        image: '/images/dalat.jpg' 
    },
    { 
        id: 2, 
        name: 'Phú Quốc', 
        desc: 'Đảo ngọc thiên đường', 
        price: '3tr', 
        hot: false, 
        image: '/images/phuquoc.jpg' 
    },
    { 
        id: 3, 
        name: 'Sa Pa', 
        desc: 'Đỉnh fansipan hùng vĩ', 
        price: '2.5tr', 
        hot: true, 
        image: '/images/sapa.jpg' 
    },
    { 
        id: 4, 
        name: 'Hà Giang', 
        desc: 'Cao nguyên đá Đồng Văn', 
        price: '2tr', 
        hot: true, 
        image: '/images/hagiang.jpg' 
    },
    { 
        id: 5, 
        name: 'Nha Trang', 
        desc: 'Bãi biển xanh ngắt', 
        price: '1.8tr', 
        hot: false, 
        image: '/images/nhatrang.jpg' 
    }
];

app.get('/', (req, res) => res.render('index', { title: 'Trang chủ' }));
app.get('/list', (req, res) => res.render('list', { title: 'Danh sách', items }));
app.get('/contact', (req, res) => res.render('contact', { title: 'Liên hệ' }));

app.get('/detail/:id', (req, res) => {
    const item = items.find(i => i.id == req.params.id);
    if (!item) return res.status(404).send('Không tìm thấy địa điểm');
    res.render('detail', { title: 'Chi tiết', item });
});

app.listen(3000, () => console.log('🚀 Server chạy tại http://localhost:3000'));