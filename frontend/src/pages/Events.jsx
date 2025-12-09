import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { eventAPI } from '../utils/api';
import './Events.css';

const Events = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    department: '',
    status: '',
  });

  useEffect(() => {
    fetchEvents();
  }, [filters, user?.role]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      let response;
      if (user?.role === 'STUDENT') {
        response = await eventAPI.getApprovedEvents(filters);
      } else {
        response = await eventAPI.getAllEvents(filters);
      }
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
    setLoading(false);
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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

  return (
    <div className="events-page">
      <div className="page-header">
        <div>
          <h1>Events</h1>
          <p>Browse and manage department events</p>
        </div>
        {(user?.role === 'FACULTY' || user?.role === 'ADMIN') && (
          <Link to="/events/create" className="btn btn-primary">
            ➕ Create Event
          </Link>
        )}
      </div>

      <div className="filters-section">
        <div className="filters">
          <select
            name="department"
            value={filters.department}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="">All Departments</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="ME">ME</option>
            <option value="EEE">EEE</option>
            <option value="ISE">ISE</option>
            <option value="CIVIL">CIVIL</option>
            <option value="AIML">AIML</option>
            <option value="AIDS">AIDS</option>
            <option value="CSBS">CSBS</option>
          </select>

          {(user?.role === 'FACULTY' || user?.role === 'ADMIN' || user?.role === 'HOD') && (
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="">All Status</option>
              <option value="APPROVED">Approved</option>
              <option value="PENDING">Pending</option>
              <option value="REJECTED">Rejected</option>
            </select>
          )}
        </div>

        <div className="results-count">
          {events.length} event{events.length !== 1 ? 's' : ''} found
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading events...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="empty-state">
          <p>No events found</p>
        </div>
      ) : (
        <div className="events-grid">
          {events.map((event) => (
            <Link to={`/events/${event._id}`} key={event._id} className="event-card">
              <div className="event-card-header">
                <h3>{event.title}</h3>
                {(user?.role !== 'STUDENT') && getStatusBadge(event.status)}
              </div>
              
              <p className="event-description">{event.description}</p>
              
              <div className="event-details">
                <div className="event-detail">
                  <span className="detail-icon">📍</span>
                  <span>{event.venue}</span>
                </div>
                <div className="event-detail">
                  <span className="detail-icon">📅</span>
                  <span>{formatDate(event.date)}</span>
                </div>
                <div className="event-detail">
                  <span className="detail-icon">🏢</span>
                  <span>{event.department}</span>
                </div>
              </div>

              {event.capacity && (
                <div className="event-capacity">
                  <div className="capacity-info">
                    <span>{event.registrationsCount} / {event.capacity}</span>
                    <span>{Math.round((event.registrationsCount / event.capacity) * 100)}% full</span>
                  </div>
                  <div className="capacity-bar">
                    <div 
                      className="capacity-fill" 
                      style={{ width: `${(event.registrationsCount / event.capacity) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;
