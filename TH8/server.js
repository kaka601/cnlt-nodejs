// PHẦN III & IV: UPLOAD FILE VỚI MULTER (một file + nhiều file)
const express = require("express");
const multer = require("multer");
const path = require("path");
const app = express();

// Cấu hình lưu trữ cho multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});

// Middleware upload 1 file (Phần III)
const upload = multer({ storage: storage }).single("file");

// Middleware upload nhiều file - tối đa 17 file (Phần IV)
const uploadManyFiles = multer({ storage }).array("many-files", 17);

// ─── PHẦN III: Upload một file ────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8"/>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Upload File - TH8</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: 'Segoe UI', sans-serif;
          background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
        }
        .container {
          display: flex;
          gap: 30px;
          flex-wrap: wrap;
          justify-content: center;
          padding: 20px;
        }
        .card {
          background: rgba(255,255,255,0.07);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 20px;
          padding: 36px 32px;
          width: 340px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
          transition: transform 0.3s;
        }
        .card:hover { transform: translateY(-4px); }
        .card h2 {
          font-size: 1.2rem;
          margin-bottom: 6px;
          color: #a78bfa;
        }
        .card p {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.55);
          margin-bottom: 20px;
        }
        .file-label {
          display: block;
          border: 2px dashed rgba(167,139,250,0.5);
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          cursor: pointer;
          color: rgba(255,255,255,0.6);
          font-size: 0.9rem;
          margin-bottom: 18px;
          transition: border-color 0.3s, background 0.3s;
        }
        .file-label:hover {
          border-color: #a78bfa;
          background: rgba(167,139,250,0.08);
        }
        input[type="file"] { display: none; }
        button[type="submit"] {
          width: 100%;
          padding: 12px;
          background: linear-gradient(90deg, #7c3aed, #a78bfa);
          border: none;
          border-radius: 10px;
          color: #fff;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.2s;
        }
        button[type="submit"]:hover { opacity: 0.88; transform: scale(1.02); }
        .badge {
          display: inline-block;
          background: rgba(167,139,250,0.2);
          color: #c4b5fd;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 999px;
          margin-bottom: 14px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
      </style>
    </head>
    <body>
      <div class="container">

        <!-- Phần III: Upload 1 file -->
        <div class="card">
          <span class="badge">Phần III</span>
          <h2>Upload Một File</h2>
          <p>Dùng module Multer – lưu file vào thư mục <code>uploads/</code></p>
          <form action="/upload" method="post" enctype="multipart/form-data">
            <label class="file-label" for="single-file">
              📁 Chọn file để upload
            </label>
            <input type="file" id="single-file" name="file" />
            <button type="submit">Upload</button>
          </form>
        </div>

        <!-- Phần IV: Upload nhiều file -->
        <div class="card">
          <span class="badge">Phần IV</span>
          <h2>Upload Nhiều File</h2>
          <p>Hỗ trợ upload tối đa <b>17 file</b> cùng lúc</p>
          <form action="/upload-many" method="post" enctype="multipart/form-data">
            <label class="file-label" for="many-files">
              📂 Chọn nhiều file (tối đa 17)
            </label>
            <input type="file" id="many-files" name="many-files" multiple />
            <button type="submit">Upload Nhiều File</button>
          </form>
        </div>

      </div>
    </body>
    </html>
  `);
});

// ─── PHẦN III: Route POST /upload (1 file) ────────────────────────────────────
app.post("/upload", (req, res) => {
  upload(req, res, (err) => {
    if (err) return res.send("Lỗi upload");
    res.send(`
      <!DOCTYPE html><html lang="vi">
      <head><meta charset="UTF-8"><title>Kết quả</title>
      <style>
        body { font-family: 'Segoe UI', sans-serif; background:#0f0c29; color:#fff;
               display:flex; align-items:center; justify-content:center; min-height:100vh; }
        .box { background:rgba(255,255,255,0.07); border:1px solid rgba(255,255,255,0.15);
               border-radius:20px; padding:40px; text-align:center; }
        h2 { color:#4ade80; margin-bottom:12px; }
        p { color:rgba(255,255,255,0.65); margin-bottom:20px; }
        a { color:#a78bfa; text-decoration:none; font-weight:600; }
      </style></head>
      <body>
        <div class="box">
          <h2>✅ Upload thành công</h2>
          <p>File <b>${req.file ? req.file.originalname : ""}</b> đã được lưu vào thư mục <code>uploads/</code></p>
          <a href="/">← Quay lại</a>
        </div>
      </body></html>
    `);
  });
});

// ─── PHẦN IV: Route POST /upload-many (nhiều file) ────────────────────────────
app.post("/upload-many", (req, res) => {
  uploadManyFiles(req, res, (err) => {
    if (err) return res.send("Lỗi upload nhiều file");
    const fileList = req.files
      .map(f => `<li><b>${f.originalname}</b> (${(f.size / 1024).toFixed(1)} KB)</li>`)
      .join("");
    res.send(`
      <!DOCTYPE html><html lang="vi">
      <head><meta charset="UTF-8"><title>Kết quả</title>
      <style>
        body { font-family: 'Segoe UI', sans-serif; background:#0f0c29; color:#fff;
               display:flex; align-items:center; justify-content:center; min-height:100vh; }
        .box { background:rgba(255,255,255,0.07); border:1px solid rgba(255,255,255,0.15);
               border-radius:20px; padding:40px; min-width:320px; }
        h2 { color:#4ade80; margin-bottom:12px; }
        p { color:rgba(255,255,255,0.65); margin-bottom:12px; }
        ul { padding-left:20px; color:rgba(255,255,255,0.8); margin-bottom:20px; }
        li { margin-bottom:6px; }
        a { color:#a78bfa; text-decoration:none; font-weight:600; }
      </style></head>
      <body>
        <div class="box">
          <h2>✅ Upload nhiều file thành công</h2>
          <p>Đã upload <b>${req.files.length}</b> file vào thư mục <code>uploads/</code>:</p>
          <ul>${fileList}</ul>
          <a href="/">← Quay lại</a>
        </div>
      </body></html>
    `);
  });
});

app.listen(8017, () => {
  console.log("Phần III & IV (Multer) đang chạy tại http://localhost:8017");
});
