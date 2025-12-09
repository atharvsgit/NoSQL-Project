import { useState, useEffect } from 'react';
import { eventAPI } from '../utils/api';
import './EventApproval.css';

const EventApproval = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchPendingEvents();
  }, []);

  const fetchPendingEvents = async () => {
    try {
      const response = await eventAPI.getAllEvents({ status: 'PENDING' });
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
      setMessage({ type: 'error', text: 'Failed to load pending events' });
    }
    setLoading(false);
  };

  const handleApproval = async (eventId, status) => {
    setActionLoading(eventId);
    try {
      await eventAPI.updateEventStatus(eventId, status);
      setMessage({ 
        type: 'success', 
        text: `Event ${status.toLowerCase()} successfully` 
      });
      fetchPendingEvents();
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Action failed' });
    }
    setActionLoading(null);
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

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading pending events...</p>
      </div>
    );
  }

  return (
    <div className="event-approval-page">
      <div className="page-header">
        <h1>Event Approval</h1>
        <p>Review and approve/reject pending events</p>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      {events.length === 0 ? (
        <div className="empty-state">
          <p>No pending events for approval</p>
        </div>
      ) : (
        <div className="approval-list">
          {events.map((event) => (
            <div key={event._id} className="approval-card">
              <div className="approval-header">
                <div>
                  <h3>{event.title}</h3>
                  <p className="organizer-info">
                    Organized by: {event.organizer.name} ({event.organizer.department})
                  </p>
                </div>
                <span className="status-badge status-pending">PENDING</span>
              </div>

              <p className="event-description">{event.description}</p>

              <div className="event-info-grid">
                <div className="info-item">
                  <span className="info-icon">📅</span>
                  <span>{formatDate(event.date)}</span>
                </div>
                <div className="info-item">
                  <span className="info-icon">📍</span>
                  <span>{event.venue}</span>
                </div>
                <div className="info-item">
                  <span className="info-icon">🏢</span>
                  <span>{event.department}</span>
                </div>
                {event.capacity && (
                  <div className="info-item">
                    <span className="info-icon">◆</span>
                    <span>Capacity: {event.capacity}</span>
                  </div>
                )}
              </div>

              <div className="approval-actions">
                <button
                  onClick={() => handleApproval(event._id, 'APPROVED')}
                  disabled={actionLoading === event._id}
                  className="btn btn-approve"
                >
                  {actionLoading === event._id ? 'Processing...' : '✓ Approve'}
                </button>
                <button
                  onClick={() => handleApproval(event._id, 'REJECTED')}
                  disabled={actionLoading === event._id}
                  className="btn btn-reject"
                >
                  {actionLoading === event._id ? 'Processing...' : '✗ Reject'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventApproval;
