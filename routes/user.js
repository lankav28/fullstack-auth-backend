// backend/routes/user.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// 🟢 GET user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ user });
  } catch (err) {
    console.error('❌ Profile Fetch Error:', err);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
});

// 🟡 UPDATE user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, bio } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: { id: user._id, name: user.name, email: user.email, bio: user.bio },
    });
  } catch (err) {
    console.error('❌ Profile Update Error:', err);
    res.status(500).json({ message: 'Server error updating profile' });
  }
});

module.exports = router;
