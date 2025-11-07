// backend/routes/auth.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// ========================
// 🟢 REGISTER USER
// ========================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // ✅ Validate inputs
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    // ✅ Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // ✅ Create new user (password gets hashed in model pre-save hook)
    const newUser = await User.create({ name, email, password });

    // ✅ Generate JWT
    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "7d" }
    );

    // ✅ Respond
    res.status(201).json({
      message: "Registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
      token,
    });
  } catch (err) {
    console.error("❌ Register Error:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// ========================
// 🟣 LOGIN USER
// ========================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("🔹 Login Attempt:", email);

    // ✅ Validate inputs
    if (!email || !password)
      return res.status(400).json({ message: "Please fill in all fields" });

    // ✅ Find user by email and explicitly include password
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      console.log("❌ No user found for:", email);
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // ✅ Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🔑 Hashed password in DB:", user.password);
    console.log("🧩 Entered password:", password);
    console.log("✅ Password match:", isMatch);

    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    // ✅ Generate JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "7d" }
    );

    // ✅ Respond
    res.json({
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

module.exports = router;
