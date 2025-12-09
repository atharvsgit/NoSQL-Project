import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const { user } = useAuth();

  const studentLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: '▪' },
    { path: '/events', label: 'Browse Events', icon: '▪' },
    { path: '/my-registrations', label: 'My Registrations', icon: '▪' },
  ];

  const facultyLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: '▪' },
    { path: '/events', label: 'All Events', icon: '▪' },
    { path: '/events/create', label: 'Create Event', icon: '+' },
    { path: '/my-registrations', label: 'My Events', icon: '▪' },
  ];

  const hodLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: '▪' },
    { path: '/events', label: 'All Events', icon: '▪' },
    { path: '/event-approval', label: 'Event Approval', icon: '✓' },
  ];

  const adminLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: '▪' },
    { path: '/events', label: 'All Events', icon: '▪' },
    { path: '/events/create', label: 'Create Event', icon: '+' },
    { path: '/event-approval', label: 'Event Approval', icon: '✓' },
    { path: '/users', label: 'User Management', icon: '◆' },
  ];

  const getLinks = () => {
    switch (user?.role) {
      case 'ADMIN':
        return adminLinks;
      case 'HOD':
        return hodLinks;
      case 'FACULTY':
        return facultyLinks;
      case 'STUDENT':
      default:
        return studentLinks;
    }
  };

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {getLinks().map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              isActive ? 'sidebar-link active' : 'sidebar-link'
            }
          >
            <span className="link-icon">{link.icon}</span>
            <span className="link-label">{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
