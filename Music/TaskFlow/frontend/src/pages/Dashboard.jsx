import { useState, useEffect } from 'react';
import { dashboardAPI } from '../services/api';

function Dashboard() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    dashboardAPI.getStats().then(res => {
      if (res.stats) setStats(res.stats);
    });
  }, []);

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Projects</h3>
          <span>{stats.totalProjects || 0}</span>
        </div>
        <div className="stat-card">
          <h3>Total Tasks</h3>
          <span>{stats.totalTasks || 0}</span>
        </div>
        <div className="stat-card">
          <h3>To Do</h3>
          <span>{stats.todoTasks || 0}</span>
        </div>
        <div className="stat-card">
          <h3>In Progress</h3>
          <span>{stats.inProgressTasks || 0}</span>
        </div>
        <div className="stat-card">
          <h3>Completed</h3>
          <span>{stats.completedTasks || 0}</span>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;