const express = require('express');
const Project = require('../models/Project');
const Task = require('../models/Task');
const router = express.Router();

// Get all projects - everyone can see all projects
router.get('/', async (req, res) => {
  try {
    console.log('GET /api/projects - Fetching all projects');
    const projects = await Project.find().populate('owner', 'username');
    console.log(`Found ${projects.length} projects`);
    res.json({ success: true, projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create project - anyone can create
router.post('/', async (req, res) => {
  try {
    const { name, description, userId } = req.body;

    console.log('Create project request:', { name, description, userId });

    if (!name) {
      return res.status(400).json({ message: 'Project name is required' });
    }

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const project = new Project({
      name,
      description,
      owner: userId
    });

    await project.save();
    await project.populate('owner', 'username');

    console.log('Project created:', project);

    res.status(201).json({ success: true, project });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete project - only owner can delete
router.delete('/:id', async (req, res) => {
  try {
    const { userId } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ message: 'Project not found' });

    // Check if user is owner
    if (project.owner.toString() !== userId) {
      return res.status(403).json({ message: 'Only project owner can delete' });
    }

    // Delete all tasks in this project
    await Task.deleteMany({ project: req.params.id });
    await Project.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;