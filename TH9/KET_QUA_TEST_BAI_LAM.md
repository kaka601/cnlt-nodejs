# KẾT QUẢ TEST BÀI THỰC HÀNH SỐ 9

## BƯỚC 1: TEST ĐĂNG NHẬP VÀ LẤY SESSION

======================================
[TEST] POST http://localhost:3000/login
[BODY]: {
  "username": "admin",
  "password": "123456"
}
[STATUS]: 200
[RESPONSE]:
{
  "message": "Login successful"
}

## BƯỚC 2: TEST THÊM MỚI SINH VIÊN (Kèm Validation)
>> THÊM MỚI HỢP LỆ:

======================================
[TEST] POST http://localhost:3000/students
[BODY]: {
  "name": "Hoang Van E",
  "email": "vane@example.com",
  "age": 20,
  "class": "CNTT2"
}
[STATUS]: 201
[RESPONSE]:
{
  "id": 4,
  "name": "Hoang Van E",
  "email": "vane@example.com",
  "age": 20,
  "class": "CNTT2",
  "isDeleted": false
}
>> THÊM MỚI KHÔNG HỢP LỆ (LỖI TRÙNG EMAIL & TUỔI):

======================================
[TEST] POST http://localhost:3000/students
[BODY]: {
  "name": "A",
  "email": "vane@example.com",
  "age": 10,
  "class": "CNTT2"
}
[STATUS]: 400
[RESPONSE]:
{
  "errors": [
    "Name must be at least 2 characters",
    "Email already exists",
    "Age must be between 16 and 60"
  ]
}

## BƯỚC 3: TEST PHÂN TRANG VÀ SẮP XẾP

======================================
[TEST] GET http://localhost:3000/students?page=1&limit=2&sort=age_desc
[STATUS]: 200
[RESPONSE]:
{
  "page": 1,
  "limit": 2,
  "total": 4,
  "data": [
    {
      "id": 2,
      "name": "Tran Thi B",
      "email": "thib@example.com",
      "age": 22,
      "class": "CNTT2",
      "isDeleted": false
    },
    {
      "id": 1,
      "name": "Nguyen Van A",
      "email": "vana@example.com",
      "age": 20,
      "class": "CNTT1",
      "isDeleted": false
    }
  ]
}

## BƯỚC 4: TEST CÁC HÀM THỐNG KÊ

======================================
[TEST] GET http://localhost:3000/students/stats
[STATUS]: 200
[RESPONSE]:
{
  "total": 4,
  "active": 4,
  "deleted": 0,
  "averageAge": 20.25
}

======================================
[TEST] GET http://localhost:3000/students/stats/class
[STATUS]: 200
[RESPONSE]:
[
  {
    "class": "CNTT1",
    "count": 2
  },
  {
    "class": "CNTT2",
    "count": 2
  }
]

## BƯỚC 5: TEST XÓA MỀM (SOFT DELETE)
>> XÓA SINH VIÊN CÓ ID = 4

======================================
[TEST] DELETE http://localhost:3000/students/4
[STATUS]: 200
[RESPONSE]:
{
  "message": "Student deleted successfully"
}
>> KIỂM TRA LẠI DANH SÁCH (SẼ KHÔNG THẤY SINH VIÊN VỪA XÓA):

======================================
[TEST] GET http://localhost:3000/students
[STATUS]: 200
[RESPONSE]:
{
  "page": 1,
  "limit": 10,
  "total": 3,
  "data": [
    {
      "id": 1,
      "name": "Nguyen Van A",
      "email": "vana@example.com",
      "age": 20,
      "class": "CNTT1",
      "isDeleted": false
    },
    {
      "id": 2,
      "name": "Tran Thi B",
      "email": "thib@example.com",
      "age": 22,
      "class": "CNTT2",
      "isDeleted": false
    },
    {
      "id": 3,
      "name": "Le Van C",
      "email": "vanc@example.com",
      "age": 19,
      "class": "CNTT1",
      "isDeleted": false
    }
  ]
}

## BƯỚC 6: TEST ĐỒNG BỘ / BẤT ĐỒNG BỘ
Gọi Heavy Async...

======================================
[TEST] GET http://localhost:3000/heavy-async
Gọi Heavy Sync...

======================================
[TEST] GET http://localhost:3000/heavy-sync
[STATUS]: 200
[RESPONSE]:
{
  "message": "Heavy sync task completed",
  "sum": 12499999995066986000
}
