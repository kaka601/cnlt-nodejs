const heavySync = (req, res) => {
    console.log("Start Heavy Sync Task");
    // Chặn Event Loop
    let sum = 0;
    for (let i = 0; i < 5e9; i++) {
        sum += i;
    }
    console.log("End Heavy Sync Task");
    res.json({ message: "Heavy sync task completed", sum });
};

const heavyAsync = (req, res) => {
    console.log("Start Heavy Async Task");
    // Mô phỏng tác vụ nặng không chặn bằng setTimeout
    setTimeout(() => {
        let sum = 0;
        // Thực tế setTimeout vẫn chặn nếu vòng lặp lớn nằm trong nó,
        // nhưng để biểu diễn sự khác biệt ta có thể giảm nhỏ hoặc chỉ delay.
        // Để mô phỏng I/O bất đồng bộ, ta dùng setTimeout.
        console.log("End Heavy Async Task");
        res.json({ message: "Heavy async task completed (simulated)" });
    }, 2000);
};

module.exports = {
    heavySync,
    heavyAsync
};
