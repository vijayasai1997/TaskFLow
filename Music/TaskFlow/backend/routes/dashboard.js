const express = require('express');
const Task = require('../models/Task');
const Project = require('../models/Project');
const router = express.Router();

router.get('/stats', async (req, res) => {
  try {
    const projects = await Project.find();
    const totalTasks = await Task.countDocuments();
    const todoTasks = await Task.countDocuments({ status: 'todo' });
    const completedTasks = await Task.countDocuments({ status: 'completed' });
    const inProgressTasks = await Task.countDocuments({ status: 'in-progress' });

    res.json({
      success: true,
      stats: {
        totalProjects: projects.length,
        totalTasks,
        todoTasks,
        completedTasks,
        inProgressTasks
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;