const fs = require('fs');

async function runTests() {
    let logFile = '';
    const log = (msg) => {
        console.log(msg);
        logFile += msg + '\n';
    };

    let sessionCookie = '';

    const makeRequest = async (method, path, body = null) => {
        log(`\n======================================`);
        log(`[TEST] ${method} http://localhost:3000${path}`);
        if (body) log(`[BODY]: ${JSON.stringify(body, null, 2)}`);
        
        const headers = {
            'Content-Type': 'application/json'
        };
        if (sessionCookie) headers['Cookie'] = sessionCookie;

        const options = {
            method,
            headers
        };
        if (body) options.body = JSON.stringify(body);

        try {
            const res = await fetch(`http://localhost:3000${path}`, options);
            
            // Extract cookie if login
            const setCookie = res.headers.get('set-cookie');
            if (setCookie) {
                sessionCookie = setCookie.split(';')[0];
            }

            const data = await res.json();
            log(`[STATUS]: ${res.status}`);
            log(`[RESPONSE]:\n${JSON.stringify(data, null, 2)}`);
            return data;
        } catch (err) {
            log(`[ERROR]: ${err.message}`);
        }
    };

    log("# KẾT QUẢ TEST BÀI THỰC HÀNH SỐ 9\n");

    log("## BƯỚC 1: TEST ĐĂNG NHẬP VÀ LẤY SESSION");
    await makeRequest('POST', '/login', { username: 'admin', password: '123456' });

    log("\n## BƯỚC 2: TEST THÊM MỚI SINH VIÊN (Kèm Validation)");
    log(">> THÊM MỚI HỢP LỆ:");
    let newStudent = await makeRequest('POST', '/students', { name: "Hoang Van E", email: "vane@example.com", age: 20, class: "CNTT2" });
    
    log(">> THÊM MỚI KHÔNG HỢP LỆ (LỖI TRÙNG EMAIL & TUỔI):");
    await makeRequest('POST', '/students', { name: "A", email: "vane@example.com", age: 10, class: "CNTT2" });

    log("\n## BƯỚC 3: TEST PHÂN TRANG VÀ SẮP XẾP");
    await makeRequest('GET', '/students?page=1&limit=2&sort=age_desc');

    log("\n## BƯỚC 4: TEST CÁC HÀM THỐNG KÊ");
    await makeRequest('GET', '/students/stats');
    await makeRequest('GET', '/students/stats/class');

    log("\n## BƯỚC 5: TEST XÓA MỀM (SOFT DELETE)");
    if (newStudent && newStudent.id) {
        log(`>> XÓA SINH VIÊN CÓ ID = ${newStudent.id}`);
        await makeRequest('DELETE', `/students/${newStudent.id}`);
        
        log(">> KIỂM TRA LẠI DANH SÁCH (SẼ KHÔNG THẤY SINH VIÊN VỪA XÓA):");
        await makeRequest('GET', '/students');
    }

    log("\n## BƯỚC 6: TEST ĐỒNG BỘ / BẤT ĐỒNG BỘ");
    log("Gọi Heavy Async...");
    makeRequest('GET', '/heavy-async');
    log("Gọi Heavy Sync...");
    await makeRequest('GET', '/heavy-sync');

    fs.writeFileSync('KET_QUA_TEST_BAI_LAM.md', logFile);
    log("\nĐã lưu toàn bộ kết quả ra file KET_QUA_TEST_BAI_LAM.md!");
}

runTests();
