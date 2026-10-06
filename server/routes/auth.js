const crypto = require("crypto");
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

const router = express.Router();

function createToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
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

// Email a password reset link
router.post("/forgot-password", async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();

    if (!email) {
      return res.status(400).json({ message: "Enter your email." });
    }

    const user = await User.findOne({ email });

    if (user) {
      const token = crypto.randomBytes(32).toString("hex");

      user.resetTokenHash = hashToken(token);
      user.resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000);
      await user.save();

      const link = `${process.env.CLIENT_URL}/?resetToken=${token}`;

      await sendEmail({
        to: user.email,
        subject: "Reset your Journal password",
        html: `
          <p>Hi${user.name ? " " + user.name : ""},</p>
          <p>We received a request to reset your Journal password. Click the link below to choose a new one. It expires in 1 hour.</p>
          <p><a href="${link}">Reset my password</a></p>
          <p>If you didn't ask for this, you can ignore this email and your password will stay the same.</p>
        `,
      });
    }

    // Same answer whether or not the email exists, so nobody can use this
    // form to find out which emails have accounts.
    res.json({
        message:
     "If an account exists for that email, a reset link has been sent. If you don't see it within a few minutes, check your spam folder.",
    });
  } catch (error) {
    console.error("Forgot password failed:", error.message);
    res
      .status(500)
      .json({ message: "Could not send the reset email. Please try again." });
  }
});

// Save a new password using the link from the email
router.post("/reset-password", async (req, res) => {
  try {
    const token = String(req.body?.token || "");
    const password = String(req.body?.password || "");

    if (!token || password.length < 8) {
      return res
        .status(400)
        .json({ message: "Enter a new password of at least 8 characters." });
    }

    const user = await User.findOne({
      resetTokenHash: hashToken(token),
      resetTokenExpires: { $gt: new Date() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "This reset link is invalid or has expired." });
    }

    user.password = await bcrypt.hash(password, 12);
    user.resetTokenHash = null;
    user.resetTokenExpires = null;
    await user.save();

    res.json({ message: "Password updated. You can now log in." });
  } catch (error) {
    console.error("Reset password failed:", error.message);
    res.status(500).json({ message: "Could not reset the password." });
  }
});

module.exports = router;