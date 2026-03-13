const express = require('express');
const path = require('path');

const app = express();
const port = 4000;


app.use(express.static('public'));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});


app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'about.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'contact.html'));
});


app.listen(port, () => {
    console.log(`Server đang chạy thành công tại: http://localhost:${port}`);
});