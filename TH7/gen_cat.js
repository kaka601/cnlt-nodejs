// Script tạo ảnh cat.png từ chuỗi base64 (theo bài TH7)
const fs = require('fs');

const base64String =
  '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';

const fileContentBuffer = Buffer.from(base64String, 'base64');
const filePath = 'files/cat.png';

fs.writeFile(filePath, fileContentBuffer, (err) => {
  if (err) throw err;
  console.log('✅ The file was successfully saved: files/cat.png');
});
