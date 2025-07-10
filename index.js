const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const path = require('path');
const app = express();

const port = 8000;
const secret = "Myfirstapp#1";

mongoose.connect('mongodb://127.0.0.1:27017/Saidb')
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.log('Mongo error:', err));

const User = require('./models/users');

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client/build')));

// JWT
function setUser(user) {
  return jwt.sign(user, secret);
}
function getUser(token) {
  return jwt.verify(token, secret);
}
function authMiddleware(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).send("Unauthorized");
  try {
    req.user = getUser(token);
    next();
  } catch {
    res.status(403).send("Forbidden");
  }
}
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mavenproject018@gmail.com',
    pass: '' // Use App Password, not Gmail password
  }
});


// Routes
app.post('/signup', async (req, res) => {
  const { firstname, email, password, city } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(409).send("User exists");

  const newUser = await User.create({ firstname, email, password, city });
  res.send("Signup successful");
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });

  if (user) {
    const token = setUser({ id: user._id });
    res.cookie('token', token, { httpOnly: true });
    res.status(200).json({ success: true });
  } else {
    res.status(401).json({ success: false });
  }
});

app.post('/main', authMiddleware, async (req, res) => {
  try {
    const { city } = req.body;
    const result = await User.find({ city });
    const emails = result.map(user => user.email);

    console.log("📨 Sending mail to:", emails);

    const mailOptions = {
      from: 'mavenproject018@gmail.com',
      to: emails.join(','),
      subject: 'Blood Request',
      text: 'A donor request has been made from your city. Please respond.'
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("❌ Email error:", error);
        return res.status(500).send("Failed to send email");
      } else {
        console.log("✅ Email sent:", info.response);
        return res.send("Request sent and email delivered");
      }
    });
  } catch (err) {
    console.error("❌ Server error:", err);
    res.status(500).send("Server error");
  }
});


// React routing fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
