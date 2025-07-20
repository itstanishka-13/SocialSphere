// ✅ Final index.js for SocialSphere project (fully working)
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const auth = require('./routes/authRoutes'); // { router, users }
const postRouter = require('./routes/postRoutes').router; // 🔥 fixed import
const userRouter = require('./routes/userRoutes');

const app = express();
const PORT = 5000;

// ✅ Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Static folders
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Routes
app.use('/auth', auth.router);       // register, login, update-profile
app.use('/posts', postRouter);       // create/view/delete/like/comment
app.use('/users', userRouter);       // follow, profile

// ✅ Home Test
app.get('/', (req, res) => {
  res.send('✅ Welcome to SocialSphere API!');
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
