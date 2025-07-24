const Task = require('../models/Task');

// GET all tasks
exports.getAllTasks = async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
};

// POST create a task
exports.createTask = async (req, res) => {
  const { title } = req.body;
  const task = await Task.create({ title });
  res.status(201).json(task);
};

// PUT update task
exports.updateTask = async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(task);
};

// DELETE task
exports.deleteTask = async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: 'Task deleted' });
};
