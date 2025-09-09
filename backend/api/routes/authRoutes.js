const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const UserDAO = require("../dao/UserDAO");

const router = express.Router();

// helpers
const signToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
    try {
        const { username, email, password, firstname, lastname } = req.body;
        if (!username || !email || !password || !firstname) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const existingUser = await UserDAO.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(409).json({ message: "Username or email already exists" });
        }
        const hashed = await bcrypt.hash(password, 10);
        const user = await UserDAO.create({ username, email, password: hashed, firstname, lastname });
        const token = signToken(user._id.toString());
        return res.status(201).json({ token, user: { id: user._id, username: user.username, email: user.email, firstname: user.firstname, lastname: user.lastname } });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Missing email or password" });
        }
        const user = await UserDAO.findOne({ email });
        if (!user) return res.status(401).json({ message: "Invalid credentials" });
        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return res.status(401).json({ message: "Invalid credentials" });
        const token = signToken(user._id.toString());
        return res.json({ token, user: { id: user._id, username: user.username, email: user.email, firstname: user.firstname, lastname: user.lastname } });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// POST /api/auth/logout (stateless - client drops token)
router.post("/logout", (req, res) => {
    return res.json({ message: "Logged out" });
});

// Password reset request
router.post("/password/forgot", async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "Email required" });
        const user = await UserDAO.findOne({ email });
        if (!user) return res.status(200).json({ message: "If the email exists, a reset link will be sent" });
        const token = crypto.randomBytes(32).toString("hex");
        const expires = new Date(Date.now() + 1000 * 60 * 30); // 30 min
        await UserDAO.update(user._id, { resetPasswordToken: token, resetPasswordExpires: expires });
        // In a real app, send email here. For this sprint, return token for manual testing
        return res.json({ message: "Reset token generated", token });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Password reset confirm
router.post("/password/reset", async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) return res.status(400).json({ message: "Token and newPassword are required" });
        const user = await UserDAO.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: new Date() } });
        if (!user) return res.status(400).json({ message: "Invalid or expired token" });
        const hashed = await bcrypt.hash(newPassword, 10);
        await UserDAO.update(user._id, { password: hashed, resetPasswordToken: null, resetPasswordExpires: null });
        return res.json({ message: "Password updated" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

module.exports = router;
