const EventEmitter = require('events');
const fs = require('fs');
const path = require('path');

class AppEmitter extends EventEmitter {
    constructor() {
        super();
        this.logFile = path.join(__dirname, '../data/log.txt');
        
        // Listener mẫu
        this.on('userAction', (data) => {
            this.logAction(data);
        });

        // Listener chỉ chạy 1 lần
        this.once('firstBoot', () => {
           console.log("Hệ thống Emitter đã khởi chạy lần đầu tiên!");
        });
    }

    logAction(data) {
        const time = new Date().toISOString();
        const logLine = `[${time}] Event Triggered: ${JSON.stringify(data)}\n`;
        
        fs.appendFile(this.logFile, logLine, (err) => {
            if(err) console.error("Lỗi ghi log:", err);
            else console.log("Đã ghi log:", logLine.trim());
        });
    }
}

// Bắn event ngay khi tạo instance
const appEmitter = new AppEmitter();
appEmitter.emit('firstBoot');

module.exports = appEmitter;
