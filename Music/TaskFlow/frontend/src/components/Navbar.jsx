import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <span>{user?.username || 'User'}</span>
      <button onClick={() => { logout(); navigate('/login'); }}>Logout</button>
    </nav>
  );
}

export default Navbar;