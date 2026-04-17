/**
 * ============================================================
 * TH LÀM THÊM - Bài 3: HTTP, URL, File System Modules
 * ============================================================
 * Nội dung:
 *  1. HTTP module
 *  2. URL module
 *  3. FS (File System) module
 *  4. Kết hợp cả 3 module – ứng dụng web đơn giản (cổng 8017)
 * ============================================================
 */

/* ============================================================
   PHẦN 1 – HTTP MODULE
   ============================================================ */

// 1a. Tạo server HTTP cơ bản (createServer)
/*
const http = require('http');

const server = http.createServer((req, res) => {
  res.write('<h1> Hi, thank you for visit </h1><hr>');
  res.end();
});

server.listen(8017, 'localhost');
// Truy cập: http://localhost:8017
*/

// 1b. Thêm res.writeHead() – định nghĩa Content-Type
/*
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<h1> Hi, thank you for visit </h1><hr>');
  res.end();
});

server.listen(8017, 'localhost');
*/

// 1c. Nhiều lần gọi res.write() – xây HTML đầy đủ
/*
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<html>');
  res.write('<head>');
  res.write('<title>Test module HTTP</title>');
  res.write('</head>');
  res.write('<body>');
  res.write('<h1> Hi, thank you for visit </h1><hr>');
  res.write('</body>');
  res.write('</html>');
  res.end();
});

server.listen(8017, 'localhost');
*/

// 1d. req.url – đọc URL mà client gửi lên
/*
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write(req.url);   // In ra phần đường dẫn sau tên miền
  res.end();
});

server.listen(8017, 'localhost');
// Thử: http://localhost:8017/trungquan?search=abc
*/


/* ============================================================
   PHẦN 2 – URL MODULE
   ============================================================ */
/*
const http = require('http');
const url  = require('url');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });

  // url.parse() phân tích chuỗi URL thành object
  let urlData = url.parse(req.url, true);
  console.log(urlData);   // In object URL ra terminal

  res.write(`param animal: ${ urlData.query.animal } <br>`);
  res.write(`param color: ${  urlData.query.color  } <br>`);
  res.end();
});

server.listen(8017, 'localhost');
// Thử: http://localhost:8017/search.html?animal=cat&color=black
*/


/* ============================================================
   PHẦN 3 – FS (FILE SYSTEM) MODULE
   ============================================================ */

// 3a. Tạo file bằng fs.writeFile()
/*
const fs = require('fs');

let fileContent = 'Ragdoll, Scottish fold, British shorthair...';
let filePath    = 'files/cats.txt';

fs.writeFile(filePath, fileContent, (err) => {
  if (err) throw err;
  console.log('The file was successfully saved.');
});
// Kết quả: tạo files/cats.txt
*/

// 3b. Tạo ảnh từ chuỗi base64 bằng fs.writeFile()
/*
const fs = require('fs');

let base64String =
  'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAA' +
  '3QAAAN0BcFOiBwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAfOSURBVFiF' +
  'rZd7UJTXGcZ/Z79v7xd25SYoiwFUEI3iNdSApdYx3hpvCVYn7Qyt1OjEVE3TNEknaZqUTKy2naQ2' +
  'jRlixrGTi6ZNrSZInIyK0RjABLyBqPFCURABWXbZ6+kfsAvoklt9Znbm7Hmf8z7Pec+Zd88ipURK' +
  'CWCKd+iqk2MNnwATwvN36gNMSI41fBLv0FUDpsh8eGAyqE8WzXf6y1+eLh02bYeiKIV3SlxRlEKH' +
  'TdtR/vJ0WTTf6TcZ1CfDMQ29sBiV4W/uvay2d/qp2lZguyvJuNVm0W4UQgi+I4QQwmbRbrwrybi1' +
  'aluBzW7R8ubey6rFqAwPcyIGNBpYfX8aG/5ygsYWD59vL7Dmj49dZbdo9wshrN9B3Gq3aPfnj49d' +
  '9fn2AmtKopERiSY2PDgSjaaPp+m/yJlo5I3HJ7L8t5VcuuZm96Zcy9rCtFybWVsrhMjoTawIIUYK' +
  'Ie63mvXPWs36Z4UQC3vnlF5Ohs2srV1bmJa7e1OupbHFQ/riffhckni7boBR9Vbnd6fF8MdV41iw' +
  '4SiH/p7H71ZmGYZYdc4ntpyqHZZgahuVarNNzUmQqckWQ1KCSQVoanYHLja6PIerrgXjHMYOg05J' +
  'fG5lpv7RZemiams289Yf4cWVY9FpNbfK3W4A4Ac58Ty6JJ25646QPzGO0t0XxboVIw1FD4xOyhhV' +
  'H22JClgBGi7etJe+W8fTr53kfJObQ8ev88iidGZNSoh6VFENAGSl2LjQ5MZ0up2jpd8ne6KTAYM3' +
  'CDJSbfzhsSmsuD+D4qcqONfoZozTNig/asbyqmZWlFRSsjqbiq0zyM5J+Ubi/ZE90kHF2wt48fGp' +
  'rCippLyqOSrvtgqcudTJui21HPjbdDJH2CDGBoryrcTDEAIeXpFFwT1JzPjxf9j1zNTbOAO21d7p' +
  '56cvVfNccSaZqVYwmUAd9JS+MTLT7fx+/WR+8lI17Z3+wQ1s3tnAuAwrxQtH9JTcYPi/xcMoXpbJ' +
  '3VmxbN7ZMLgBu1XL67/J6fliNPbU8A7i9ZI8YqwD+0DEgNWizXr+F1nEhRvFHdx9GHEOAy9smIKi' +
  'KCMGGBBCKM2t3nsWzkjqmVWUO777MBbOSqWj05cX7prhCkwbl2EXQ2y6PgO9qDlzg9yle1iypobr' +
  'bfJrBUperSHl3p28vacranyIXU9mhj0ATOtvIH1MmqXvuvcz8Mhzx0hx5vHEM39l7s8rqai8Oqj4' +
  '2S87eGX7WUrfeJeG1ruZvOiDqLxxo4aoQHrEgEZDsjPB2Kfar+lU1jYT6A7x/q7deH1QfbJ1UAMf' +
  'HryCzZxA2e5yztef52R9S1RemtNm1GhIht5GZDHpTDq135mHQpGh3abH5XJxrv4cbncnqcOi93QA' +
  'Z7KFUKiRhroGtDqVGKs+Kk+v0yg6VdVHKnDT5as5/aWrjxEMRoaP/WwsJxqOUl17CCLEZ7KFUKiR' +
  'hroGtDqVGKs+Kk+v0yg6VdVHKnDT5as5/aWrjxEMRoaP/WwsJxqOUl17CCH=';

let fileContentBuffer = Buffer.from(base64String, 'base64');
let filePath = 'files/cat.png';

fs.writeFile(filePath, fileContentBuffer, (err) => {
  if (err) throw err;
  console.log('The file was successfully saved.');
});
*/

// 3c. Đọc file bằng fs.readFile()
/*
const http = require('http');
const fs   = require('fs');

const server = http.createServer((req, res) => {
  let filePath = 'files/cat.html';

  fs.readFile(filePath, (err, data) => {
    if (err) throw err;
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(data);
    res.end();
  });
});

server.listen(8017, 'localhost');
*/

// 3d. Cập nhật (thêm nội dung vào cuối) bằng fs.appendFile()
/*
const fs = require('fs');

let content  = ', Korat cat';
let filePath = 'files/cats.txt';

fs.appendFile(filePath, content, (err) => {
  if (err) throw err;
  console.log('The file was successfully updated.');
});
*/

// 3e. Đổi tên file bằng fs.rename()
/*
const fs = require('fs');

fs.rename('files/cats.txt', 'files/những con mèo.txt', (err) => {
  if (err) throw err;
  console.log('The file was successfully renamed.');
});
*/

// 3f. Xóa file bằng fs.unlink()
/*
const fs = require('fs');

fs.unlink('files/những con mèo.txt', (err) => {
  if (err) throw err;
  console.log('The file was successfully deleted.');
});
*/


/* ============================================================
   PHẦN 4 – KẾT HỢP CẢ 3 MODULE: ỨNG DỤNG WEB ĐƠN GIẢN
   Chạy: node server.js
   Truy cập: http://localhost:8017
   ============================================================ */

const http = require('http');
const url  = require('url');
const fs   = require('fs');

const server = http.createServer((req, res) => {
  // Phân tích URL để lấy pathname
  let urlData  = url.parse(req.url, true);
  let pathname = urlData.pathname;

  // Xác định file cần đọc
  let fileName = './views' + pathname;
  if (pathname === '/') {
    fileName = './views/index.html';
  }

  // Đọc file và trả về cho client
  fs.readFile(fileName, (err, data) => {
    if (err) {
      console.log(err);
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.write('<h2>404 – Không tìm thấy trang!</h2>');
      res.write(`<p>Đường dẫn <strong>${pathname}</strong> không tồn tại.</p>`);
      res.write('<a href="/">← Về trang chủ</a>');
      return res.end();
    }

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.write(data);
    return res.end();
  });
});

server.listen(8017, 'localhost', () => {
  console.log('✅  Server đang chạy tại http://localhost:8017');
  console.log('   Thử các URL:');
  console.log('     http://localhost:8017/');
  console.log('     http://localhost:8017/index.html');
  console.log('     http://localhost:8017/cat.html');
  console.log('     http://localhost:8017/dog.html');
});

// Xử lý lỗi khi cổng đã bị chiếm
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error('❌ Cổng 8017 đang bị chiếm bởi tiến trình khác!');
    console.error('   Chạy lệnh sau để giải phóng cổng rồi thử lại:');
    console.error('   fuser -k 8017/tcp');
    process.exit(1);
  } else {
    throw err;
  }
});
