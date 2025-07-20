const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const users = [];

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, 'user_' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

router.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: "User already exists!" });
  }

  const newUser = {
    id: users.length + 1,
    name,
    email,
    password,
    profilePic: "",
    bio: "",
    followers: [],
    following: [],
    followRequests: [],
    blocked: []
  };

  users.push(newUser);
  res.status(201).json({ message: "User registered!", user: newUser });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  res.json({ message: "Login successful", user });
});

router.get('/all', (req, res) => res.json(users));

router.post('/update-profile', upload.single('profilePic'), (req, res) => {
  const { userId, bio } = req.body;
  const user = users.find(u => u.id === parseInt(userId));
  if (!user) return res.status(404).json({ message: "User not found" });

  if (bio) user.bio = bio;
  if (req.file) user.profilePic = `/uploads/${req.file.filename}`;
  res.json({ message: "Profile updated", user });
});

router.post('/block', (req, res) => {
  const { blockerId, blockeeId } = req.body;
  const blocker = users.find(u => u.id === parseInt(blockerId));
  if (!blocker.blocked.includes(blockeeId)) {
    blocker.blocked.push(blockeeId);
  }
  res.json({ message: "User blocked" });
});

router.get('/blocklist/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  const blockedUsers = users.filter(u => user.blocked.includes(u.id));
  res.json(blockedUsers);
});

module.exports = { router, users };
