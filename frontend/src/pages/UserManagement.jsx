import { useState, useEffect } from 'react';
import { userAPI } from '../utils/api';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [newRole, setNewRole] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  const roles = ['STUDENT', 'FACULTY', 'HOD', 'ADMIN'];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await userAPI.getAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setMessage({ type: 'error', text: 'Failed to load users' });
    }
    setLoading(false);
  };

  const handleRoleUpdate = async (userId) => {
    if (!newRole) return;
    
    try {
      await userAPI.updateUserRole(userId, newRole);
      setMessage({ type: 'success', text: 'User role updated successfully' });
      setEditingUser(null);
      setNewRole('');
      fetchUsers();
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to update role' });
    }
  };

  const startEditing = (user) => {
    setEditingUser(user._id);
    setNewRole(user.role);
  };

  const cancelEditing = () => {
    setEditingUser(null);
    setNewRole('');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className="user-management-page">
      <div className="page-header">
        <h1>User Management</h1>
        <p>Manage user roles and permissions</p>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.department}</td>
                <td>
                  {editingUser === user._id ? (
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      className="role-select"
                    >
                      {roles.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className={`role-badge role-${user.role.toLowerCase()}`}>
                      {user.role}
                    </span>
                  )}
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  {editingUser === user._id ? (
                    <div className="action-buttons">
                      <button
                        onClick={() => handleRoleUpdate(user._id)}
                        className="btn-save"
                      >
                        ✓
                      </button>
                      <button onClick={cancelEditing} className="btn-cancel">
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => startEditing(user)}
                      className="btn-edit"
                    >
                      Edit Role
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
