// PHẦN II: UPLOAD FILE VỚI FORMIDABLE
const http = require("http");
const fs = require("fs");
const formidable = require("formidable");

http.createServer((req, res) => {
  // Xử lý POST /upload
  if (req.url == "/upload" && req.method.toLowerCase() == "post") {
    const form = new formidable.IncomingForm();
    form.uploadDir = "uploads/";

    form.parse(req, (err, fields, files) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/html; charset=utf-8" });
        res.end("Lỗi khi parse form");
        return;
      }

      // Tương thích formidable v2 và v3
      const fileObj = files.file && files.file[0] ? files.file[0] : files.file;
      const tmpPath = fileObj.filepath || fileObj.path;
      const originalName = fileObj.originalFilename || fileObj.name;
      const newPath = form.uploadDir + originalName;

      fs.rename(tmpPath, newPath, (err) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "text/html; charset=utf-8" });
          res.end("Lỗi upload");
          return;
        }
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(`<p>Upload thành công: <b>${originalName}</b></p><a href="/">Quay lại</a>`);
      });
    });
    return;
  }

  // Trang chủ: hiển thị form upload
  if (req.url == "/") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.write(`
      <!DOCTYPE html>
      <html lang="vi">
      <head><meta charset="UTF-8"><title>Upload - Formidable</title></head>
      <body>
        <h2>Upload File với Formidable (Phần II)</h2>
        <form action="/upload" method="post" enctype="multipart/form-data">
          <input type="file" name="file" />
          <button type="submit">Upload</button>
        </form>
      </body>
      </html>
    `);
    return res.end();
  }

  // 404 fallback
  res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
  res.end("404 Not Found");

}).listen(3000, () => {
  console.log("Phần II (Formidable) đang chạy tại http://localhost:3000");
});
