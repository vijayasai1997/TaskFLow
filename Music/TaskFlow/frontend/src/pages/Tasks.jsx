import { useState, useEffect } from 'react';
import { taskAPI, projectAPI } from '../services/api';
import './Tasks.css';

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium', project: '', dueDate: '', status: 'todo' });

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Tasks page: Loading tasks and projects...');
        const [tasksRes, projectsRes] = await Promise.all([
          taskAPI.getAll(),
          projectAPI.getAll()
        ]);
        console.log('Tasks page: Tasks response:', tasksRes);
        console.log('Tasks page: Projects response:', projectsRes);
        console.log('Tasks page: Projects array:', projectsRes.projects);
        console.log('Tasks page: Number of projects for dropdown:', projectsRes.projects?.length || 0);

        setTasks(tasksRes.tasks || []);
        setProjects(projectsRes.projects || []);
      } catch (err) {
        console.error('Tasks page: Error loading data:', err);
      }
    };
    loadData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await taskAPI.create({ ...newTask, projectId: newTask.project });
      setTasks([res.task, ...tasks]);
      setNewTask({ title: '', description: '', priority: 'medium', project: '', dueDate: '', status: 'todo' });
      setShowModal(false);
    } catch (err) {
      console.error('Failed to create task:', err);
      alert('Failed to create task');
    }
  };

  const handleUpdate = async (task) => {
    try {
      const res = await taskAPI.update(task._id, task);
      setTasks(tasks.map(t => t._id === task._id ? res.task : t));
    } catch (err) {
      console.error('Failed to update task:', err);
      alert('Failed to update task');
    }
  };

  const handleDelete = async (id, createdById) => {
    const currentUserId = localStorage.getItem('userId');
    if (createdById !== currentUserId) {
      alert('Only the task creator can delete this task');
      return;
    }
    if (window.confirm('Delete task?')) {
      try {
        await taskAPI.delete(id);
        setTasks(tasks.filter(t => t._id !== id));
      } catch (err) {
        console.error('Failed to delete task:', err);
        alert('Failed to delete task');
      }
    }
  };

  const filtered = tasks.filter(t => {
    if (filter === 'all') return true;
    return t.status === filter;
  });

  const currentUserId = localStorage.getItem('userId');

  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <h1>Tasks</h1>
        <button onClick={() => setShowModal(true)} className="new-task-btn">+ New Task</button>
      </div>

      <div className="filter-buttons">
        {['all', 'todo', 'in-progress', 'completed'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`filter-btn ${filter === f ? 'active' : ''}`}
          >
            {f === 'in-progress' ? 'In Progress' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="tasks-list">
        {filtered.map(task => (
          <div key={task._id} className="task-item">
            <div className="task-content">
              {task.project && <span className="project-tag">{task.project.name}</span>}
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p style={{ fontSize: '0.9em', color: '#666' }}>
                Created by: {task.createdBy?.username}
                {task.dueDate && ` • Due: ${new Date(task.dueDate).toLocaleDateString()}`}
              </p>
            </div>
            <div className="task-actions">
              <select
                value={task.status}
                onChange={(e) => handleUpdate({ ...task, status: e.target.value })}
                style={{ padding: '5px', marginRight: '10px' }}
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>

              {task.createdBy?._id === currentUserId && (
                <input
                  type="date"
                  value={task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''}
                  onChange={(e) => handleUpdate({ ...task, dueDate: e.target.value })}
                  style={{ padding: '5px', marginRight: '10px', fontSize: '0.9em' }}
                  title="Edit due date (owner only)"
                />
              )}

              <span className={`priority-badge priority-${task.priority}`}>{task.priority}</span>
              {task.createdBy?._id === currentUserId && (
                <button
                  onClick={() => handleDelete(task._id, task.createdBy._id)}
                  className="action-btn delete"
                >×</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>New Task</h2>
            <form onSubmit={handleCreate}>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Project ({projects.length} available)
                </label>
                <select
                  value={newTask.project}
                  onChange={e => setNewTask({ ...newTask, project: e.target.value })}
                  required
                  style={{ width: '100%', padding: '8px' }}
                >
                  <option value="">Select Project</option>
                  {projects.map(p => (
                    <option key={p._id} value={p._id}>
                      {p.name} (by {p.owner?.username})
                    </option>
                  ))}
                </select>
              </div>

              <input
                type="text"
                placeholder="Title"
                value={newTask.title}
                onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                required
              />

              <textarea
                placeholder="Description"
                value={newTask.description}
                onChange={e => setNewTask({ ...newTask, description: e.target.value })}
              />

              <select
                value={newTask.priority}
                onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>

              <input
                type="date"
                value={newTask.dueDate}
                onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })}
              />

              <div className="form-actions" style={{ display: 'flex', gap: '10px' }}>
                <button type="submit">Create</button>
                <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tasks;