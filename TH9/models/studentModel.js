const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/students.json');

const readData = () => {
    try {
        if (!fs.existsSync(dataPath)) {
            return [];
        }
        const data = fs.readFileSync(dataPath, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Lỗi đọc file:", err.message);
        return [];
    }
};

const writeData = (data) => {
    try {
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 4));
    } catch (err) {
        console.error("Lỗi ghi file:", err.message);
    }
};

module.exports = {
    readData,
    writeData
};
