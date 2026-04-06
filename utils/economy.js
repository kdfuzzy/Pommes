const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/economy.json');

// 📁 Ensure file exists
if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(path.dirname(dataPath), { recursive: true });
    fs.writeFileSync(dataPath, JSON.stringify({}, null, 2));
}

// 📥 Load data
function loadData() {
    return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
}

// 💾 Save data
function saveData(data) {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

// 💰 Get balance
function getBalance(userId) {
    const data = loadData();
    return data[userId]?.balance || 0;
}

// ➕ Add money
function addBalance(userId, amount) {
    const data = loadData();

    if (!data[userId]) {
        data[userId] = {
            balance: 0,
            wins: 0,
            losses: 0
        };
    }

    data[userId].balance += amount;

    saveData(data);
}

// ➖ Remove money
function removeBalance(userId, amount) {
    const data = loadData();

    if (!data[userId]) {
        data[userId] = {
            balance: 0,
            wins: 0,
            losses: 0
        };
    }

    data[userId].balance -= amount;

    if (data[userId].balance < 0) {
        data[userId].balance = 0;
    }

    saveData(data);
}

// ♻️ Reset money
function resetBalance(userId) {
    const data = loadData();

    data[userId] = {
        balance: 0,
        wins: 0,
        losses: 0
    };

    saveData(data);
}

// 🏆 Add win
function addWin(userId) {
    const data = loadData();

    if (!data[userId]) {
        data[userId] = {
            balance: 0,
            wins: 0,
            losses: 0
        };
    }

    data[userId].wins += 1;

    saveData(data);
}

// 💀 Add loss
function addLoss(userId) {
    const data = loadData();

    if (!data[userId]) {
        data[userId] = {
            balance: 0,
            wins: 0,
            losses: 0
        };
    }

    data[userId].losses += 1;

    saveData(data);
}

// 📊 Get stats
function getStats(userId) {
    const data = loadData();

    if (!data[userId]) {
        return {
            balance: 0,
            wins: 0,
            losses: 0
        };
    }

    return data[userId];
}

module.exports = {
    getBalance,
    addBalance,
    removeBalance,
    resetBalance,
    addWin,
    addLoss,
    getStats
};
