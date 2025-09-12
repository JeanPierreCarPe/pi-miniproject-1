const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const UserDAO = require("../dao/UserDAO");
const { sendPasswordResetEmail } = require("../utils/mailer");

const router = express.Router();

// helpers
const signToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const emailRegex = /^(?:[a-zA-Z0-9_'^&+\-`{}~!#$%*?\/|=]+(?:\.[a-zA-Z0-9_'^&+\-`{}~!#$%*?\/|=]+)*)@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
const passwordRegexSignup = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/; // 8+, lower, upper, digit, special
const passwordRegexReset = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/; // 8+, lower, upper, digit

// No username autogeneration in sprint 1

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
    try {
        const { email, password, firstname, lastname, age } = req.body;
        if (!email || !password || !firstname || !lastname || age === undefined) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }
        if (!passwordRegexSignup.test(password)) {
            return res.status(400).json({ message: "Password does not meet complexity requirements" });
        }
        const numericAge = Number(age);
        if (!Number.isInteger(numericAge) || numericAge < 13) {
            return res.status(400).json({ message: "Age must be an integer and at least 13" });
        }

        const existingByEmail = await UserDAO.findOne({ email });
        if (existingByEmail) {
            return res.status(409).json({ message: "Email already exists" });
        }
        let userData = { email, firstname, lastname, age: numericAge };
        const hashed = await bcrypt.hash(password, 10);
        userData.password = hashed;
        const user = await UserDAO.create(userData);
        const token = signToken(user._id.toString());
        return res.status(201).json({ token, user: { id: user._id, email: user.email, firstname: user.firstname, lastname: user.lastname, age: user.age } });
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
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }
        const user = await UserDAO.findOne({ email });
        if (!user) return res.status(401).json({ message: "Invalid credentials" });
        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return res.status(401).json({ message: "Invalid credentials" });
        const token = signToken(user._id.toString());
        return res.json({ token, user: { id: user._id, email: user.email, firstname: user.firstname, lastname: user.lastname, age: user.age } });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// POST /api/auth/logout (stateless - client drops token)
router.post("/logout", (req, res) => {
    return res.json({ message: "Logged out" });
});

// Funcionalidad de reset password deshabilitada para este sprint
/* 
// Password reset request
router.post("/password/forgot", async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "Email required" });
        if (!emailRegex.test(email)) return res.status(202).json({ message: "Si el correo existe, te enviaremos un enlace" });
        const user = await UserDAO.findOne({ email });
        // Always respond 202 to prevent enumeration
        if (!user) return res.status(202).json({ message: "Si el correo existe, te enviaremos un enlace" });
        const token = crypto.randomBytes(32).toString("hex");
        const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
        await UserDAO.update(user._id, { resetPasswordToken: token, resetPasswordExpires: expires });
        try {
            await sendPasswordResetEmail({ to: email, token });
        } catch (mailErr) {
            if (process.env.NODE_ENV !== "production") {
                console.error("Mail send error:", mailErr.message);
            }
        }
        return res.status(202).json({ message: "Si el correo existe, te enviaremos un enlace" });
    } catch (error) {
        if (process.env.NODE_ENV !== "production") {
            console.error("forgot error:", error.message);
        }
        return res.status(500).json({ message: "Inténtalo de nuevo más tarde" });
    }
});
*/

/*
// Password reset confirm
router.post("/password/reset", async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) return res.status(400).json({ message: "Token and newPassword are required" });
        if (!passwordRegexReset.test(newPassword)) return res.status(400).json({ message: "Password does not meet complexity requirements" });
        const user = await UserDAO.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: new Date() } });
        if (!user) return res.status(400).json({ message: "Invalid or expired token" });
        const hashed = await bcrypt.hash(newPassword, 10);
        await UserDAO.update(user._id, { password: hashed, resetPasswordToken: null, resetPasswordExpires: null });
        return res.status(200).json({ message: "Contraseña actualizada" });
    } catch (error) {
        if (process.env.NODE_ENV !== "production") {
            console.error("reset error:", error.message);
        }
        return res.status(500).json({ message: "Inténtalo de nuevo más tarde" });
    }
});

// GET /api/auth/password/verify?token=XYZ
router.get("/password/verify", async (req, res) => {
    try {
        const { token } = req.query;
        if (!token) return res.status(400).json({ valid: false, message: "Token requerido" });
        const user = await UserDAO.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: new Date() } });
        if (!user) return res.status(200).json({ valid: false, message: "Enlace inválido o caducado" });
        return res.status(200).json({ valid: true });
    } catch (error) {
        if (process.env.NODE_ENV !== "production") {
            console.error("verify error:", error.message);
        }
        return res.status(500).json({ message: "Inténtalo de nuevo más tarde" });
    }
});
*/

module.exports = router;