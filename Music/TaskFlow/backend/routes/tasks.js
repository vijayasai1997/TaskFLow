const express = require('express');
const Task = require('../models/Task');
const router = express.Router();

// Get all tasks - everyone can see all tasks
router.get('/', async (req, res) => {
  try {
    const { projectId, status } = req.query;
    let query = {};
    if (projectId) query.project = projectId;
    if (status) query.status = status;

    const tasks = await Task.find(query)
      .populate('project', 'name')
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 });

    res.json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create task - anyone can create
router.post('/', async (req, res) => {
  try {
    const { title, description, projectId, priority, dueDate, userId } = req.body;

    const task = new Task({
      title,
      description,
      project: projectId,
      priority,
      dueDate,
      createdBy: userId
    });

    await task.save();
    await task.populate('project', 'name');
    await task.populate('createdBy', 'username');

    res.status(201).json({ success: true, task });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update task - everyone can update (collaborative)
router.put('/:id', async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, status, priority, dueDate },
      { new: true }
    ).populate('project', 'name').populate('createdBy', 'username');

    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ success: true, task });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete task - only creator can delete
router.delete('/:id', async (req, res) => {
  try {
    const { userId } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Check if user is the creator
    if (task.createdBy.toString() !== userId) {
      return res.status(403).json({ message: 'Only task creator can delete' });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;