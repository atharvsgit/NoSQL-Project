import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { eventAPI, registrationAPI } from '../utils/api';
import './EventDetails.css';

const EventDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchEventDetails();
    if (user?.role === 'STUDENT') {
      checkRegistrationStatus();
    }
    if (user?.role === 'FACULTY' || user?.role === 'ADMIN') {
      fetchRegistrations();
    }
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const response = await eventAPI.getEventById(id);
      setEvent(response.data);
    } catch (error) {
      console.error('Error fetching event:', error);
      setMessage({ type: 'error', text: 'Failed to load event details' });
    }
    setLoading(false);
  };

  const checkRegistrationStatus = async () => {
    try {
      const response = await registrationAPI.getUserRegistrations();
      const registered = response.data.some(reg => reg.event._id === id);
      setIsRegistered(registered);
    } catch (error) {
      console.error('Error checking registration:', error);
    }
  };

  const fetchRegistrations = async () => {
    try {
      const response = await registrationAPI.getEventRegistrations(id);
      setRegistrations(response.data);
    } catch (error) {
      console.error('Error fetching registrations:', error);
    }
  };

  const handleRegister = async () => {
    setActionLoading(true);
    try {
      await registrationAPI.registerForEvent(id);
      setMessage({ type: 'success', text: 'Successfully registered for the event!' });
      setIsRegistered(true);
      fetchEventDetails();
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to register' });
    }
    setActionLoading(false);
  };

  const handleUnregister = async () => {
    if (!window.confirm('Are you sure you want to unregister?')) return;
    
    setActionLoading(true);
    try {
      await registrationAPI.unregisterFromEvent(id);
      setMessage({ type: 'success', text: 'Successfully unregistered from the event' });
      setIsRegistered(false);
      fetchEventDetails();
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to unregister' });
    }
    setActionLoading(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    
    setActionLoading(true);
    try {
      await eventAPI.deleteEvent(id);
      setMessage({ type: 'success', text: 'Event deleted successfully' });
      setTimeout(() => navigate('/events'), 1500);
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to delete event' });
      setActionLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
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

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading event details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="error-container">
        <p>Event not found</p>
        <Link to="/events" className="btn btn-secondary">Back to Events</Link>
      </div>
    );
  }

  const canEdit = user?.role === 'ADMIN' || 
    (user?.role === 'FACULTY' && event.organizer._id === user._id);
  const isPastEvent = new Date(event.date) < new Date();
  const isFull = event.capacity && event.registrationsCount >= event.capacity;

  return (
    <div className="event-details-page">
      <div className="breadcrumb">
        <Link to="/events">Events</Link>
        <span> / </span>
        <span>{event.title}</span>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="event-details-card">
        <div className="event-header">
          <div>
            <h1>{event.title}</h1>
            <div className="event-organizer">
              Organized by: {event.organizer.name} ({event.organizer.department})
            </div>
          </div>
          {(user?.role !== 'STUDENT') && getStatusBadge(event.status)}
        </div>

        <div className="event-content">
          <div className="event-info-grid">
            <div className="info-item">
              <span className="info-label">📅 Date & Time</span>
              <span className="info-value">{formatDate(event.date)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">▪ Venue</span>
              <span className="info-value">{event.venue}</span>
            </div>
            <div className="info-item">
              <span className="info-label">▪ Department</span>
              <span className="info-value">{event.department}</span>
            </div>
            {event.capacity && (
              <div className="info-item">
                <span className="info-label">◆ Capacity</span>
                <span className="info-value">
                  {event.registrationsCount} / {event.capacity} registered
                </span>
              </div>
            )}
          </div>

          <div className="event-description-section">
            <h2>About This Event</h2>
            <p>{event.description}</p>
          </div>

          {event.capacity && (
            <div className="capacity-section">
              <div className="capacity-bar">
                <div 
                  className="capacity-fill" 
                  style={{ width: `${(event.registrationsCount / event.capacity) * 100}%` }}
                ></div>
              </div>
              <span className="capacity-percentage">
                {Math.round((event.registrationsCount / event.capacity) * 100)}% full
              </span>
            </div>
          )}

          <div className="action-buttons">
            {user?.role === 'STUDENT' && event.status === 'APPROVED' && !isPastEvent && (
              <>
                {!isRegistered ? (
                  <button
                    onClick={handleRegister}
                    disabled={actionLoading || isFull}
                    className="btn btn-primary"
                  >
                    {actionLoading ? 'Registering...' : isFull ? 'Event Full' : 'Register for Event'}
                  </button>
                ) : (
                  <button
                    onClick={handleUnregister}
                    disabled={actionLoading}
                    className="btn btn-danger"
                  >
                    {actionLoading ? 'Unregistering...' : 'Unregister'}
                  </button>
                )}
              </>
            )}

            {canEdit && (
              <>
                <Link to={`/events/edit/${event._id}`} className="btn btn-secondary">
                  ✏️ Edit Event
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={actionLoading}
                  className="btn btn-danger"
                >
                  {actionLoading ? 'Deleting...' : '🗑️ Delete Event'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {(user?.role === 'FACULTY' || user?.role === 'ADMIN') && registrations.length > 0 && (
        <div className="registrations-section">
          <h2>Registered Participants ({registrations.length})</h2>
          <div className="registrations-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Registered On</th>
                  <th>Attended</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((reg) => (
                  <tr key={reg._id}>
                    <td>{reg.user.name}</td>
                    <td>{reg.user.email}</td>
                    <td>{reg.user.department}</td>
                    <td>{new Date(reg.registeredAt).toLocaleDateString()}</td>
                    <td>{reg.attended ? '✓ Yes' : '✗ No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetails;
