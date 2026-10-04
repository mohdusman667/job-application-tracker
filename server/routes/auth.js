const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

function createToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

// Create a new account
router.post("/register", async (req, res) => {
  try {
    const name = String(req.body?.name || "").trim();
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "");

    if (!email || password.length < 8) {
      return res.status(400).json({
        message: "Enter an email and a password of at least 8 characters.",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "An account with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({
      token: createToken(user),
      user: { id: user._id, name: user.name, email: user.email },
    });
    } catch (error) {
     console.error("Register failed:", error.message);
     res.status(500).json({ message: "Could not create the account." });
   }
});

// Log in to an existing account
router.post("/login", async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "");

    const user = await User.findOne({ email });
    const passwordMatches = user
      ? await bcrypt.compare(password, user.password)
      : false;

    if (!passwordMatches) {
      return res.status(401).json({ message: "Incorrect email or password." });
    }

    res.json({
      token: createToken(user),
      user: { id: user._id, name: user.name, email: user.email },
    });
      } catch (error) {
     console.error("Login failed:", error.message);
     res.status(500).json({ message: "Could not log in." });
   }
});

module.exports = router;