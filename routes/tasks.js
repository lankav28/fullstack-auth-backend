// backend/routes/tasks.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Task = require("../models/Task");

// 🟢 GET all tasks for the logged-in user
router.get("/", auth, async (req, res) => {
  try {
    const { search, status, priority } = req.query;

    // ✅ Use _id (Mongo format), not id
    const filter = { user: req.user._id };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (search) filter.title = { $regex: search, $options: "i" };

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json({ tasks });
  } catch (err) {
    console.error("❌ Error fetching tasks:", err);
    res.status(500).json({ message: "Server error fetching tasks" });
  }
});

// 🟡 CREATE a new task
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, status, priority } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await Task.create({
      user: req.user._id,
      title,
      description,
      status,
      priority,
    });

    res.status(201).json({ message: "Task created successfully", task });
  } catch (err) {
    console.error("❌ Error creating task:", err);
    res.status(500).json({ message: "Server error creating task" });
  }
});

// 🟠 UPDATE a task
router.put("/:id", auth, async (req, res) => {
  try {
    const { title, description, status, priority } = req.body;

    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (title) task.title = title;
    if (description) task.description = description;
    if (status) task.status = status;
    if (priority) task.priority = priority;

    await task.save();
    res.json({ message: "Task updated successfully", task });
  } catch (err) {
    console.error("❌ Error updating task:", err);
    res.status(500).json({ message: "Server error updating task" });
  }
});

// 🔴 DELETE a task
router.delete("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting task:", err);
    res.status(500).json({ message: "Server error deleting task" });
  }
});

module.exports = router;
