const express = require('express');
const router = express.Router();
const auth = require('./authRoutes');
const users = auth.users;
const postRoutes = require('./postRoutes');
const posts = postRoutes.posts;

// ✅ Get profile data with posts and requests
router.get('/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ message: "User not found!" });

  const userPosts = posts.filter(p => p.userId === userId);
  res.json({
    ...user,
    posts: userPosts,
    followRequests: user.followRequests || []
  });
});

// ✅ Send request
router.post('/:id/request', (req, res) => {
  const toUserId = parseInt(req.params.id);
  const { fromId } = req.body;

  const toUser = users.find(u => u.id === toUserId);
  if (!toUser) return res.status(404).json({ message: "User not found" });

  if (!toUser.followRequests.includes(fromId)) {
    toUser.followRequests.push(fromId);
  }

  res.json({ message: "Request sent!" });
});

// ✅ Accept request
router.post('/:id/accept', (req, res) => {
  const userId = parseInt(req.params.id);
  const { followerId } = req.body;

  const user = users.find(u => u.id === userId);
  const follower = users.find(u => u.id === followerId);
  if (!user || !follower) return res.status(404).json({ message: "User not found" });

  user.followRequests = user.followRequests.filter(id => id !== followerId);
  if (!user.followers.includes(followerId)) user.followers.push(followerId);
  if (!follower.following.includes(userId)) follower.following.push(userId);

  res.json({ message: "Request accepted!" });
});

// ✅ Standard follow
router.post('/:id/follow', (req, res) => {
  const userId = parseInt(req.params.id);
  const { followerId } = req.body;

  const user = users.find(u => u.id === userId);
  const follower = users.find(u => u.id === followerId);
  if (!user || !follower) return res.status(404).json({ message: "User not found" });

  if (!user.followers.includes(followerId)) user.followers.push(followerId);
  if (!follower.following.includes(userId)) follower.following.push(userId);

  res.json({ message: "Followed successfully!" });
});

module.exports = router;
