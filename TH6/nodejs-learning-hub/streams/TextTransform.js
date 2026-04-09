const { Transform } = require('stream');

class TextTransform extends Transform {
    constructor(options) {
        super(options);
    }

    _transform(chunk, encoding, callback) {
        try {
            // Biến đổi text (uppercase)
            const resultString = chunk.toString().toUpperCase();
            // Đẩy dữ liệu đã biến đổi vào luồng
            this.push(resultString);
            callback();
        } catch (err) {
            callback(err);
        }
    }
}

module.exports = TextTransform;
