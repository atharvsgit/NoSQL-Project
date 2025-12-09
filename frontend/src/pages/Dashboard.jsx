import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { eventAPI, registrationAPI } from '../utils/api';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    myRegistrations: 0,
    pendingApprovals: 0,
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [user?.role]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      if (user?.role === 'STUDENT') {
        const [events, registrations] = await Promise.all([
          eventAPI.getApprovedEvents(),
          registrationAPI.getUserRegistrations(),
        ]);
        setStats({
          totalEvents: events.count,
          upcomingEvents: events.data.filter(e => new Date(e.date) > new Date()).length,
          myRegistrations: registrations.count,
        });
        setRecentEvents(events.data.slice(0, 5));
      } else if (user?.role === 'FACULTY' || user?.role === 'ADMIN' || user?.role === 'HOD') {
        const events = await eventAPI.getAllEvents();
        const pending = events.data.filter(e => e.status === 'PENDING');
        const upcoming = events.data.filter(e => 
          e.status === 'APPROVED' && new Date(e.date) > new Date()
        );
        setStats({
          totalEvents: events.count,
          upcomingEvents: upcoming.length,
          pendingApprovals: pending.length,
        });
        setRecentEvents(events.data.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
    setLoading(false);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status) => {
    const statusClass = {
      APPROVED: 'status-approved',
      PENDING: 'status-pending',
      REJECTED: 'status-rejected',
    };
    return <span className={`status-badge ${statusClass[status]}`}>{status}</span>;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {user?.name}</h1>
        <p className="dashboard-subtitle">
          {user?.role} • {user?.department} Department
        </p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>{stats.totalEvents}</h3>
            <p>Total Events</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">▪</div>
          <div className="stat-content">
            <h3>{stats.upcomingEvents}</h3>
            <p>Upcoming Events</p>
          </div>
        </div>

        {user?.role === 'STUDENT' && (
          <div className="stat-card">
            <div className="stat-icon">▪</div>
            <div className="stat-content">
              <h3>{stats.myRegistrations}</h3>
              <p>My Registrations</p>
            </div>
          </div>
        )}

        {(user?.role === 'ADMIN' || user?.role === 'HOD') && (
          <div className="stat-card">
            <div className="stat-icon">▪</div>
            <div className="stat-content">
              <h3>{stats.pendingApprovals}</h3>
              <p>Pending Approvals</p>
            </div>
          </div>
        )}
      </div>

      <div className="recent-events-section">
        <div className="section-header">
          <h2>Recent Events</h2>
          <Link to="/events" className="btn btn-secondary">View All</Link>
        </div>

        <div className="events-list">
          {recentEvents.length === 0 ? (
            <div className="empty-state">
              <p>No events found</p>
            </div>
          ) : (
            recentEvents.map((event) => (
              <Link to={`/events/${event._id}`} key={event._id} className="event-card">
                <div className="event-card-header">
                  <h3>{event.title}</h3>
                  {(user?.role === 'ADMIN' || user?.role === 'HOD' || user?.role === 'FACULTY') && 
                    getStatusBadge(event.status)
                  }
                </div>
                <p className="event-description">{event.description}</p>
                <div className="event-meta">
                  <span>▪ {event.venue}</span>
                  <span>▪ {formatDate(event.date)}</span>
                  <span>▪ {event.department}</span>
                </div>
                {event.capacity && (
                  <div className="event-capacity">
                    <div className="capacity-bar">
                      <div 
                        className="capacity-fill" 
                        style={{ width: `${(event.registrationsCount / event.capacity) * 100}%` }}
                      ></div>
                    </div>
                    <span className="capacity-text">
                      {event.registrationsCount} / {event.capacity} registered
                    </span>
                  </div>
                )}
              </Link>
            ))
          )}
        </div>
      </div>

      {user?.role === 'FACULTY' && (
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <Link to="/events/create" className="btn btn-primary">
              + Create New Event
            </Link>
            <Link to="/events" className="btn btn-secondary">
              ▪ View My Events
            </Link>
          </div>
        </div>
      )}

      {(user?.role === 'ADMIN' || user?.role === 'HOD') && stats.pendingApprovals > 0 && (
        <div className="pending-approvals-alert">
          <div className="alert-content">
            <span className="alert-icon">!</span>
            <p>You have {stats.pendingApprovals} event(s) pending approval</p>
            <Link to="/event-approval" className="btn btn-primary">
              Review Events
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
