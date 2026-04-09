const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

// Các module tùy chỉnh
const appEmitter = require('./events/AppEmitter');
const TextTransform = require('./streams/TextTransform');
const EchoDuplex = require('./streams/EchoDuplex');

const PORT = 3000;
const DATA_DIR = path.join(__dirname, 'data');
const STORY_FILE = path.join(DATA_DIR, 'story.txt');

// Helper function để đọc file views
const renderHTML = (res, viewPath, reqData = null) => {
    const fullPath = path.join(__dirname, 'views', viewPath);
    fs.readFile(fullPath, 'utf8', (err, content) => {
        if (err) {
            res.writeHead(500);
            res.end("Lỗi Server");
            return;
        }

        // Thay nội dung request (để demo Trang 3)
        if (reqData) {
            content = content.replace('{{req_data}}', JSON.stringify(reqData));
        }

        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.write(content);
        res.end();
    });
};

const server = http.createServer((req, res) => {
    // Sử dụng url.parse theo đúng yêu cầu đề bài
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const method = req.method;

    // Phục vụ file tĩnh (CSS)
    if (pathname === '/css/style.css' && method === 'GET') {
        const cssPath = path.join(__dirname, 'public', 'css', 'style.css');
        const readStream = fs.createReadStream(cssPath);
        res.writeHead(200, { 'Content-Type': 'text/css' });
        readStream.pipe(res);
        return;
    }

    // ===== ROUTING CHÍNH MÀN HÌNH ===== //
    if (method === 'GET') {
        // Trang 1: Trang chủ
        if (pathname === '/' || pathname === '/index.html') {
            return renderHTML(res, 'index.html');
        }
        
        // Trang 2: Sự kiện
        else if (pathname === '/events') {
            return renderHTML(res, 'events.html');
        }
        
        // Trang 3: URL, Request, Header
        else if (pathname === '/request') {
            const reqData = {
                url: req.url,
                method: req.method,
                query: parsedUrl.query,
                headers: req.headers,
                // Mock custom response headers setting
                responseHeaders: {
                    'X-Powered-By': 'Nodejs-Vanilla',
                    'Custom-Header': 'CNLT-TH6'
                }
            };
            
            // Cài đặt response header như yêu cầu (res.writeHead)
            res.setHeader('X-Powered-By', 'Nodejs-Vanilla');
            res.setHeader('Custom-Header', 'CNLT-TH6');
            
            return renderHTML(res, 'request.html', reqData);
        }
        
        // Trang 4: Streams
        else if (pathname === '/streams') {
            return renderHTML(res, 'streams.html');
        }
        
        // ===== CÁC ENDPOINT CHỨC NĂNG ===== //
        
        // Trả JSON
        else if (pathname === '/json') {
            const data = {
                message: "Xin chào từ Node.js Server",
                status: "success",
                timestamp: new Date()
            };
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
        }

        // Trả Image qua Stream
        else if (pathname === '/image') {
            const imgPath = path.join(__dirname, 'public', 'images', 'sample.jpg');
            fs.access(imgPath, fs.constants.F_OK, (err) => {
                if(err) {
                    res.writeHead(404);
                    return res.end('Image Not Found');
                }
                res.writeHead(200, { 'Content-Type': 'image/jpeg' });
                // Readable Stream -> pass to Response
                const readStream = fs.createReadStream(imgPath);
                readStream.pipe(res);
            });
        }

        // Trigger EventEmitter
        else if (pathname === '/event') {
            const eventPayload = { ip: req.socket.remoteAddress, action: 'Triggered from web endpoint' };
            appEmitter.emit('userAction', eventPayload);
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: "Event emitted", payload: eventPayload }));
        }

        // Đọc File Log
        else if (pathname === '/download-log') {
            const logFile = path.join(DATA_DIR, 'log.txt');
            res.writeHead(200, {
                'Content-Type': 'text/plain; charset=utf-8',
                'Content-Disposition': 'attachment; filename="server-log.txt"'
            });
            fs.createReadStream(logFile).pipe(res);
        }
        
        // Luồng Duplex (Readable file story.txt => Duplex Echo => Client)
        else if (pathname === '/streams/duplex') {
            res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
            const readStream = fs.createReadStream(STORY_FILE, { encoding: 'utf8' });
            const duplexStream = new EchoDuplex();
            readStream.pipe(duplexStream).pipe(res);
        }

        // 404 Route
        else {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>404 - Khong tim thay trang</h1>');
        }
    } 
    
    // ===== POST ROUTES ===== //
    else if (method === 'POST') {
        
        // Xử lý Writable Stream (Nhận file text từ form submit)
        if (pathname === '/streams/write') {
            const writeStream = fs.createWriteStream(path.join(DATA_DIR, 'output.txt'), { flags: 'a' });
            let body = '';
            
            req.on('data', chunk => {
                body += chunk.toString();
            });

            req.on('end', () => {
                // Phân tích "content=abc" từ form submission
                let contentText = body;
                if(body.startsWith('content=')) {
                    contentText = decodeURIComponent(body.split('=')[1]);
                }
                
                // Ghi vào file qua writable stream 
                // Ở đây ta gọi write(), đây là API của Writable stream.
                writeStream.write(`\n--- Input lúc ${new Date().toISOString()} ---\n`);
                writeStream.write(contentText + "\n");
                writeStream.end();

                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end("<script>window.close();</script>"); // Dành cho dummyframe
            });
        }
        
        // Xử lý Transform Stream
        else if (pathname === '/streams/transform') {
            // Setup luồng Transform
            const transformStream = new TextTransform();
            
            res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
            
            // Nối luồng (pipeline) Request -> Transform -> Response
            req.pipe(transformStream).pipe(res);
        }

        else {
            res.writeHead(404);
            res.end();
        }
    }
});

server.listen(PORT, () => {
    console.log(`Server HTTP thuần đang chạy tại http://localhost:${PORT}`);
});
