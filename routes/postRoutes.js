// ✅ Final postRoutes.js with working export of posts[]
const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// 🖼️ Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// 📦 In-memory storage
const posts = [];

// 📌 Create a post
router.post('/', upload.single('image'), (req, res) => {
  const { userId, content } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : '';

  if (!userId || !content) {
    return res.status(400).json({ message: "Missing userId or content!" });
  }

  const newPost = {
    id: posts.length + 1,
    userId: parseInt(userId),
    content,
    image,
    likes: [],
    comments: []
  };

  posts.push(newPost);
  res.status(201).json({ message: "Post created!", post: newPost });
});


// 🔁 Get all posts
router.get('/', (req, res) => {
  res.status(200).json(posts);
});

// 🔍 Get single post by ID
router.get('/:id', (req, res) => {
  const postId = parseInt(req.params.id);
  const post = posts.find(p => p.id === postId);
  if (!post) return res.status(404).json({ message: "Post not found!" });
  res.json(post);
});

// ❤️ Like a post
router.post('/:id/like', (req, res) => {
  const postId = parseInt(req.params.id);
  const { userId } = req.body;

  const post = posts.find(p => p.id === postId);
  if (!post) return res.status(404).json({ message: "Post not found!" });

  if (post.likes.includes(userId)) {
    return res.status(400).json({ message: "You already liked this post!" });
  }

  post.likes.push(userId);
  res.status(200).json({ message: "Post liked!", likes: post.likes });
});

// 💬 Add a comment
router.post('/:id/comment', (req, res) => {
  const postId = parseInt(req.params.id);
  const { userId, text } = req.body;

  const post = posts.find(p => p.id === postId);
  if (!post) return res.status(404).json({ message: "Post not found!" });

  const comment = {
    id: post.comments.length + 1,
    userId,
    text
  };

  post.comments.push(comment);
  res.status(201).json({ message: "Comment added!", comment });
});
// 🗑️ DELETE a post by ID
router.delete('/:id', (req, res) => {
  const postId = parseInt(req.params.id);
  const index = posts.findIndex(p => p.id === postId);
  
  if (index === -1) {
    return res.status(404).json({ message: "Post not found" });
  }

  posts.splice(index, 1);
  res.status(200).json({ message: "Post deleted successfully" });
});

module.exports = {
  router,
  posts // ✅ Export posts to be used in userRoutes.js
};
