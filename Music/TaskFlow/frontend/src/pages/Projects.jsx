import { useState, useEffect } from 'react';
import { projectAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import './Projects.css';

function Projects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });

  useEffect(() => {
    const loadProjects = async () => {
      try {
        console.log('Projects page: Loading projects...');
        const res = await projectAPI.getAll();
        console.log('Projects page: Response received:', res);
        console.log('Projects page: Projects array:', res.projects);
        console.log('Projects page: Number of projects:', res.projects?.length || 0);
        setProjects(res.projects || []);
      } catch (err) {
        console.error('Projects page: Error loading projects:', err);
      }
    };
    loadProjects();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await projectAPI.create(newProject);
      setProjects([res.project, ...projects]);
      setNewProject({ name: '', description: '' });
      setShowForm(false);
    } catch (err) {
      console.error('Failed to create project:', err);
      alert('Failed to create project');
    }
  };

  const handleDelete = async (id, ownerId) => {
    const currentUserId = localStorage.getItem('userId');
    if (ownerId !== currentUserId) {
      alert('Only the project owner can delete this project');
      return;
    }
    if (window.confirm('Delete project?')) {
      try {
        await projectAPI.delete(id);
        setProjects(projects.filter(p => p._id !== id));
      } catch (err) {
        console.error('Failed to delete project:', err);
        alert('Failed to delete project');
      }
    }
  };

  const currentUserId = localStorage.getItem('userId');

  return (
    <div className="projects-container">
      <div className="projects-header">
        <h1>Projects</h1>
        <button onClick={() => setShowForm(true)} className="new-project-btn">+ New Project</button>
      </div>

      <p style={{ padding: '10px', color: '#666' }}>
        Showing {projects.length} project(s)
      </p>

      {projects.length === 0 ? (
        <div className="empty-state">
          <p>No projects yet. Create your first project!</p>
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map(project => (
            <div key={project._id} className="stat-card" onClick={() => navigate(`/tasks?project=${project._id}`)}>
              <h3>{project.name}</h3>
              <p>{project.description || 'No description'}</p>
              <div className="project-footer">
                <span>Owner: {project.owner?.username || 'Unknown'}</span>
                {project.owner?._id === currentUserId && (
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(project._id, project.owner._id); }}
                    className="action-btn delete"
                  >×</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>New Project</h2>
            <form onSubmit={handleCreate}>
              <input
                type="text"
                placeholder="Project Name"
                value={newProject.name}
                onChange={e => setNewProject({ ...newProject, name: e.target.value })}
                required
              />
              <textarea
                placeholder="Description"
                value={newProject.description}
                onChange={e => setNewProject({ ...newProject, description: e.target.value })}
              />
              <div className="form-actions" style={{ display: 'flex', gap: '10px' }}>
                <button type="submit">Create</button>
                <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Projects;