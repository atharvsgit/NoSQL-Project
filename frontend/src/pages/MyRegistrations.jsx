import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { registrationAPI } from '../utils/api';
import './MyRegistrations.css';

const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const response = await registrationAPI.getUserRegistrations();
      setRegistrations(response.data);
    } catch (error) {
      console.error('Error fetching registrations:', error);
    }
    setLoading(false);
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

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your registrations...</p>
      </div>
    );
  }

  return (
    <div className="my-registrations-page">
      <div className="page-header">
        <h1>My Registrations</h1>
        <p>Events you've registered for</p>
      </div>

      {registrations.length === 0 ? (
        <div className="empty-state">
          <p>You haven't registered for any events yet</p>
          <Link to="/events" className="btn btn-primary">
            Browse Events
          </Link>
        </div>
      ) : (
        <div className="registrations-list">
          {registrations.map((reg) => (
            <div key={reg._id} className="registration-card">
              <div className="registration-header">
                <div>
                  <Link to={`/events/${reg.event._id}`} className="event-title">
                    {reg.event.title}
                  </Link>
                  <div className="event-badges">
                    {getStatusBadge(reg.event.status)}
                    {reg.attended && (
                      <span className="attended-badge">✓ Attended</span>
                    )}
                  </div>
                </div>
              </div>

              <p className="event-description">{reg.event.description}</p>

              <div className="event-details">
                <div className="detail-item">
                  <span className="detail-icon">📍</span>
                  <span>{reg.event.venue}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">📅</span>
                  <span>{formatDate(reg.event.date)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">🏢</span>
                  <span>{reg.event.department}</span>
                </div>
              </div>

              <div className="registration-footer">
                <span className="registered-date">
                  Registered on {new Date(reg.registeredAt).toLocaleDateString()}
                </span>
                <Link to={`/events/${reg.event._id}`} className="btn btn-secondary">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRegistrations;
