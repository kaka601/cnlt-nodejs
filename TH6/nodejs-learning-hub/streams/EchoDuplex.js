const { Duplex } = require('stream');

class EchoDuplex extends Duplex {
    constructor(options) {
        super(options);
    }

    // Nhận dữ liệu (Writable side)
    _write(chunk, encoding, callback) {
        // Nhận dữ liệu, xử lý (echo), và đẩy ra lại
        const str = chunk.toString();
        const echoStr = `[Dữ liệu được xử lý qua Duplex] -> ${str}`;
        
        // Push dữ liệu vào luồng đọc (Readable side)
        this.push(Buffer.from(echoStr));
        callback();
    }

    // Trả dữ liệu (Readable side)
    _read(size) {
        // Dữ liệu đã được push trực tiếp trong hàm _write
        // _read được định nghĩa để Stream nội bộ Node biết cách kéo dữ liệu
    }

    // Sự kiện khi luồng Write kết thúc
    _final(callback) {
        // Khi không còn nạp dữ liệu vào nữa, phát tín hiệu null để kết thúc luồng Đọc
        this.push(null);
        callback();
    }
}

module.exports = EchoDuplex;
