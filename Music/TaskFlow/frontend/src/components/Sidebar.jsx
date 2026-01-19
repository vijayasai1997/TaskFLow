import { Link, useLocation } from 'react-router-dom';

function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="sidebar">
      <div className="brand">TaskFlow</div>
      <nav>
        <Link to="/" className={pathname === '/' ? 'active' : ''}>Dashboard</Link>
        <Link to="/tasks" className={pathname === '/tasks' ? 'active' : ''}>Tasks</Link>
        <Link to="/projects" className={pathname === '/projects' ? 'active' : ''}>Projects</Link>
      </nav>
    </aside>
  );
}

export default Sidebar;