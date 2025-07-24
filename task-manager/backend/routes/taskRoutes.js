const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const auth = require("../middleware/auth");
const controller = require("../controllers/taskController");

// ✅ Get all tasks for a user
router.get("/tasks", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching tasks" });
  }
});

// ✅ Create a new task
router.post("/tasks", auth, async (req, res) => {
  const { title, dueDate } = req.body;
  if (!title || title.trim() === "") {
  return res.status(400).json({ message: "Title is required" });
}

  const task = new Task({
    title,
    userId: req.user.id,
    dueDate,
  });
  await task.save();
});


// ✅ Toggle complete status
router.put("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
    if (!task) return res.status(404).json({ error: "Task not found" });

    task.completed = !task.completed;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Error updating task" });
  }
});

// ✅ Delete a task
router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!task) return res.status(404).json({ error: "Task not found" });

    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting task" });
  }
});

module.exports = router;
