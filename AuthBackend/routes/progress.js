const express = require("express");
const verifyToken = require("../middleware/authMiddleware");
const User = require("../models/user");

const router = express.Router();

// ✅ GET progress for logged-in user
router.get("/", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json(user.progress || {});
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch progress" });
    }
});

// ✅ UPDATE progress (topic-wise)
router.post("/update", verifyToken, async (req, res) => {
    const { topic, subtopic } = req.body;

    if (!topic || !subtopic) {
        return res.status(400).json({ message: "Topic and subtopic are required" });
    }

    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        if (!user.progress) user.progress = {};

        // Mark subtopic as completed
        if (!user.progress[topic]) user.progress[topic] = {};
        user.progress[topic][subtopic] = true;
        user.markModified('progress');
        await user.save();
        res.json({ message: "Progress updated successfully!" });
    } catch (err) {
        res.status(500).json({ message: "Update failed", error: err.message });
    }
});

module.exports = router;
