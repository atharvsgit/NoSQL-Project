import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { eventAPI } from '../utils/api';
import './CreateEvent.css';

const CreateEvent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    department: user?.department || 'CSE',
    date: '',
    venue: '',
    capacity: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const departments = ['CSE', 'ECE', 'ME', 'EEE', 'ISE', 'CIVIL', 'AIML', 'AIDS', 'CSBS'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (new Date(formData.date) < new Date()) {
      setError('Event date must be in the future');
      return;
    }

    setLoading(true);
    try {
      const eventData = {
        ...formData,
        capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
      };
      
      const response = await eventAPI.createEvent(eventData);
      navigate(`/events/${response.data._id}`);
    } catch (error) {
      setError(error.message || 'Failed to create event');
      setLoading(false);
    }
  };

  return (
    <div className="create-event-page">
      <div className="page-header">
        <h1>Create New Event</h1>
        <p>Fill in the details to create a new department event</p>
      </div>

      <div className="form-card">
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="event-form">
          <div className="form-group">
            <label htmlFor="title">Event Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., TechFest 2025"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide detailed description of the event..."
              rows="5"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="department">Department *</label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="venue">Venue *</label>
              <input
                type="text"
                id="venue"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                placeholder="e.g., Main Auditorium"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">Date & Time *</label>
              <input
                type="datetime-local"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="capacity">Capacity (Optional)</label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="Max attendees"
                min="1"
              />
            </div>
          </div>

          <div className="info-box">
            <p>ℹ️ Your event will be submitted with <strong>PENDING</strong> status and will require approval from Admin/HOD before students can register.</p>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/events')}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating Event...' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
