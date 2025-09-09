const express = require("express");
const TaskDAO = require("../dao/TaskDAO");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// GET /api/tasks - list tasks of logged user
router.get("/", auth, async (req, res) => {
    try {
        const tasks = await TaskDAO.getAll({ ownerId: req.userId, isActive: true });
        return res.json(tasks);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// POST /api/tasks - create task for logged user
router.post("/", auth, async (req, res) => {
    try {
        const { Title, detail, initDate, endDate, stageName } = req.body;
        if (!Title || !initDate) {
            return res.status(400).json({ message: "Title and initDate are required" });
        }
        const task = await TaskDAO.create({ Title, detail, initDate, endDate, stageName, ownerId: req.userId });
        return res.status(201).json(task);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

module.exports = router;
