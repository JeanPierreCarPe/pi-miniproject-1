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

// PUT /api/tasks/:id - update existing task
router.put("/:id", auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { Title, detail, initDate, endDate, stageName } = req.body;
        const userId = req.userId;

        // Build update data conditionally
        const updateData = {};

        // Validate and set Title if provided
        if (Title !== undefined) {
            if (String(Title).trim().length === 0 || String(Title).trim().length > 50) {
                return res.status(400).json({ message: "Title must be 1-50 characters" });
            }
            updateData.Title = String(Title).trim();
        }

        // Validate and set detail if provided
        if (detail !== undefined) {
            if (String(detail).trim().length > 500) {
                return res.status(400).json({ message: "Detail must be up to 500 characters" });
            }
            updateData.detail = String(detail).trim() || null;
        }

        // Validate and set stageName if provided
        if (stageName !== undefined) {
            const allowedStages = ['Por hacer', 'Haciendo', 'Hecho'];
            if (!allowedStages.includes(stageName)) {
                return res.status(400).json({ message: "Invalid stageName" });
            }
            updateData.stageName = stageName;
        }

        // Set initDate if provided
        if (initDate !== undefined) {
            // Validate that initDate is a valid date
            const dateObj = new Date(initDate);
            if (isNaN(dateObj.getTime())) {
                return res.status(400).json({ message: "Invalid initDate format" });
            }
            updateData.initDate = dateObj;
        }

        // Set endDate if provided
        if (endDate !== undefined) {
            if (endDate === null || endDate === '') {
                updateData.endDate = null;
            } else {
                // Validate that endDate is a valid date
                const dateObj = new Date(endDate);
                if (isNaN(dateObj.getTime())) {
                    return res.status(400).json({ message: "Invalid endDate format" });
                }
                updateData.endDate = dateObj;
            }
        }

        // Check if at least one field is being updated
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "At least one field must be provided for update" });
        }

        // Check if task exists and belongs to user
        const existingTask = await TaskDAO.findOne({ _id: id, ownerId: userId, isActive: true });
        if (!existingTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        const updatedTask = await TaskDAO.update(id, updateData);

        // Format response with ISO-8601 updatedAt
        const taskResponse = {
            _id: updatedTask._id,
            Title: updatedTask.Title,
            detail: updatedTask.detail,
            initDate: updatedTask.initDate,
            endDate: updatedTask.endDate,
            stageName: updatedTask.stageName,
            ownerId: updatedTask.ownerId,
            isActive: updatedTask.isActive,
            createdAt: updatedTask.createdAt,
            updatedAt: updatedTask.updatedAt.toISOString()
        };

        return res.status(200).json(taskResponse);

    } catch (error) {
        // Log error for debugging in both environments
        console.error("Task update error:", error.message);
        console.error("Error stack:", error.stack);
        console.error("Request body:", req.body);
        console.error("Request params:", req.params);

        // Handle specific MongoDB errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: "Invalid data format" });
        }
        
        if (error.message.includes('Document not found')) {
            return res.status(404).json({ message: "Task not found" });
        }

        // Generic 5xx error
        return res.status(500).json({ message: "No pudimos actualizar tu tarea" });
    }
});

module.exports = router;
