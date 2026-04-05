const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data.json');

function getData() {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify({}));
    }
    return JSON.parse(fs.readFileSync(filePath));
}

function saveData(data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// 💰 BALANCE
function getBalance(userId) {
    const data = getData();
    return data[userId]?.balance || 0;
}

function addBalance(userId, amount) {
    const data = getData();

    if (!data[userId]) {
        data[userId] = { balance: 0, stats: { wins: 0, losses: 0 } };
    }

    data[userId].balance += amount;
    saveData(data);
}

function removeBalance(userId, amount) {
    const data = getData();

    if (!data[userId]) {
        data[userId] = { balance: 0, stats: { wins: 0, losses: 0 } };
    }

    data[userId].balance -= amount;
    saveData(data);
}

// 📊 STATS
function addWin(userId) {
    const data = getData();

    if (!data[userId]) {
        data[userId] = { balance: 0, stats: { wins: 0, losses: 0 } };
    }

    data[userId].stats.wins += 1;
    saveData(data);
}

function addLoss(userId) {
    const data = getData();

    if (!data[userId]) {
        data[userId] = { balance: 0, stats: { wins: 0, losses: 0 } };
    }

    data[userId].stats.losses += 1;
    saveData(data);
}

function getStats(userId) {
    const data = getData();
    return data[userId]?.stats || { wins: 0, losses: 0 };
}

function getAllUsers() {
    return getData();
}

module.exports = {
    getBalance,
    addBalance,
    removeBalance,
    addWin,
    addLoss,
    getStats,
    getAllUsers
};
