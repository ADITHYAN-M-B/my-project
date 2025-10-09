// server.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(express.json()); 

// 1. Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/bankDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// 2. Define User Schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    balance: { type: Number, required: true, min: 0 }
});

const User = mongoose.model('User', userSchema);

// 3. Create new user
app.post('/createusers', async (req, res) => {
    try {
        const { name, balance } = req.body;

        if (!name || balance === undefined) {
            return res.status(400).json({ error: "Name and balance are required" });
        }
        if (balance < 0) {
            return res.status(400).json({ error: "Balance cannot be negative" });
        }

        const newUser = new User({ name, balance });
        await newUser.save();

        res.status(201).json({
            message: "User created successfully",
            user: newUser
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ error: "User with this name already exists" });
        }
        res.status(500).json({ error: err.message });
    }
});

// 4. Transfer money using user names
app.post('/transfer', async (req, res) => {
    try {
        const { fromUserName, toUserName, amount } = req.body;

        if (!fromUserName || !toUserName || amount === undefined) {
            return res.status(400).json({ error: "fromUserName, toUserName, and amount are required" });
        }
        if (amount <= 0) return res.status(400).json({ error: "Transfer amount must be positive" });

        const fromUser = await User.findOne({ name: fromUserName });
        const toUser = await User.findOne({ name: toUserName });

        if (!fromUser) return res.status(404).json({ error: "Sender account not found" });
        if (!toUser) return res.status(404).json({ error: "Receiver account not found" });

        if (fromUser.balance < amount) {
            return res.status(400).json({ error: "Insufficient balance" });
        }

        // Sequential updates
        fromUser.balance -= amount;
        await fromUser.save();

        toUser.balance += amount;
        await toUser.save();

        res.json({
            message: `Transferred ${amount} successfully`,
            fromUser: { name: fromUser.name, balance: fromUser.balance },
            toUser: { name: toUser.name, balance: toUser.balance }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. List all users
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start server
const PORT = 3011;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
