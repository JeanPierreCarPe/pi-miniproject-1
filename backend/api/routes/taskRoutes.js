const express = require("express");
const TaskDAO = require("../dao/TaskDAO");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// GET /api/tasks - list tasks of logged user
router.get("/", auth, async (req, res) => {
    try {
        const tasks = await TaskDAO.getAll({ ownerId: req.userId, isActive: true });
        // Sort by date ascending for list view
        tasks.sort((a, b) => new Date(a.initDate) - new Date(b.initDate));
        return res.json(tasks);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// POST /api/tasks - create task for logged user
router.post("/", auth, async (req, res) => {
    try {
        const { Title, detail, initDate, endDate, stageName } = req.body;
        if (!Title || !initDate || !stageName) {
            return res.status(400).json({ message: "Title, initDate and stageName are required" });
        }
        if (String(Title).trim().length === 0 || String(Title).trim().length > 50) {
            return res.status(400).json({ message: "Title must be 1-50 characters" });
        }
        if (detail && String(detail).trim().length > 500) {
            return res.status(400).json({ message: "Detail must be up to 500 characters" });
        }
        const allowed = ['Por hacer', 'Haciendo', 'Hecho'];
        if (!allowed.includes(stageName)) {
            return res.status(400).json({ message: "Invalid stageName" });
        }
        const task = await TaskDAO.create({ Title: String(Title).trim(), detail: detail ? String(detail).trim() : undefined, initDate, endDate, stageName, ownerId: req.userId });
        return res.status(201).json(task);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

module.exports = router;
