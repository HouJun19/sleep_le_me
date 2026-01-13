const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const fs = require('fs');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.'));

// In-memory data storage (in production, use a database)
let users = {};
const dataFile = './users.json';

// Load users from file
if (fs.existsSync(dataFile)) {
  users = JSON.parse(fs.readFileSync(dataFile));
}

// Save users to file
function saveUsers() {
  fs.writeFileSync(dataFile, JSON.stringify(users, null, 2));
}

// Email transporter (configure with your email service)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASSWORD
  }
});

// Register user
app.post('/register', (req, res) => {
  const { email, name } = req.body;
  if (!email || !name) {
    return res.status(400).json({ error: 'Email and name are required' });
  }
  if (users[email]) {
    return res.status(400).json({ error: 'User already exists' });
  }
  users[email] = {
    name,
    lastCheckin: null,
    consecutiveMisses: 0,
    checkinHistory: []
  };
  saveUsers();
  res.json({ message: 'User registered successfully' });
});

// Check-in
app.post('/checkin', (req, res) => {
  const { email } = req.body;
  if (!users[email]) {
    return res.status(404).json({ error: 'User not found' });
  }
  const today = new Date().toISOString().split('T')[0];
  if (users[email].lastCheckin === today) {
    return res.status(400).json({ error: 'Already checked in today' });
  }
  users[email].lastCheckin = today;
  users[email].consecutiveMisses = 0; // Reset misses
  users[email].checkinHistory.push({ date: today, timestamp: new Date().toISOString() });
  saveUsers();
  res.json({ message: 'Check-in successful' });
});

// Get user account info
app.get('/account/:email', (req, res) => {
  const { email } = req.params;
  if (!users[email]) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  const user = users[email];
  
  // Handle legacy users without checkinHistory
  if (!user.checkinHistory) {
    user.checkinHistory = [];
    saveUsers();
  }
  
  const totalCheckins = user.checkinHistory.length;
  
  // Calculate current streak
  let streak = 0;
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  if (user.checkinHistory.length > 0) {
    const sortedHistory = [...user.checkinHistory].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    if (sortedHistory[0].date === today || sortedHistory[0].date === yesterday) {
      streak = 1;
      for (let i = 0; i < sortedHistory.length - 1; i++) {
        const current = new Date(sortedHistory[i].date);
        const next = new Date(sortedHistory[i + 1].date);
        const diff = (current - next) / (1000 * 60 * 60 * 24);
        if (diff === 1) {
          streak++;
        } else {
          break;
        }
      }
    }
  }
  
  res.json({
    name: user.name,
    email: email,
    totalCheckins,
    streak,
    checkinHistory: user.checkinHistory
  });
});

// Daily check function
function dailyCheck() {
  const today = new Date();
  Object.keys(users).forEach(email => {
    const lastCheckin = new Date(users[email].lastCheckin);
    const daysSince = Math.floor((today - lastCheckin) / (1000 * 60 * 60 * 24));
    if (daysSince > 2) {
      users[email].consecutiveMisses += 1;
      if (users[email].consecutiveMisses >= 2) {
        // Send email
        const mailOptions = {
          from: 'your-email@gmail.com',
          to: email,
          subject: '签到提醒 - 死了么',
          text: `亲爱的${users[email].name}，您已经超过两天没有签到了！请及时签到。`
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log('Error sending email:', error);
          } else {
            console.log('Email sent:', info.response);
          }
        });
      }
    } else {
      users[email].consecutiveMisses = 0;
    }
  });
  saveUsers();
}

// Run daily check every day at midnight (for demo, run every minute)
setInterval(dailyCheck, 60 * 1000); // Every minute for testing

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});