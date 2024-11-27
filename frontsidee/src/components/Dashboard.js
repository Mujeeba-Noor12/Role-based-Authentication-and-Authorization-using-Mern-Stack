import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [role, setRole] = useState(null);
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]);
  const [fetchingUsers, setFetchingUsers] = useState(false);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        console.log('No token found, redirecting to login');
        window.location.href = '/';
        return;
      }

      try {
        const response = await axios.get('http://localhost:4000/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserInfo(response.data);
        setRole(response.data.role);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        window.location.href = '/';
      }
    };

    fetchUserInfo();
  }, []);

  const fetchAllUsers = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token found, redirecting to login');
      window.location.href = '/';
      return;
    }

    setFetchingUsers(true);

    try {
      const response = await axios.get('http://localhost:4000/api/users/admin', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Fetched users:', response.data);
      setAllUsers(response.data);
    } catch (err) {
      console.error('Error fetching all users:', err);
      const errorMessage =
        err.response?.data?.message || err.message || 'An unexpected error occurred.';
      setError(errorMessage);
    } finally {
      setFetchingUsers(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = allUsers.slice(indexOfFirstUser, indexOfLastUser);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(allUsers.length / usersPerPage)) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h1>Dashboard</h1>
        <ul>
          <li className="active">Dashboard</li>
          <li>Users</li>
          <li>Projects</li>
          <li>Settings</li>
        </ul>
      </aside>

      <main className="content">
        <header className="header">
          <h2>Dashboard</h2>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </header>

        {role === 'admin' && (
          <div className="admin-section">
            <h3>All Users</h3>
            <button className="btn-fetch" onClick={fetchAllUsers} disabled={fetchingUsers}>
              {fetchingUsers ? 'Loading users...' : 'Fetch All Users'}
            </button>
            {error && <p className="error">{error}</p>}

            <div className="users-list">
              {currentUsers.length === 0 ? (
                <p></p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentUsers.map((user) => (
                      <tr key={user._id}>
                        <td>{user.fullname || 'N/A'}</td>
                        <td>{user.email}</td>
                        <td>
                          <button className="btn-profile">See Profile</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {allUsers.length > usersPerPage && (
                <div className="pagination">
                  <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                    Previous
                  </button>
                  <span>
                    Page {currentPage} of {Math.ceil(allUsers.length / usersPerPage)}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === Math.ceil(allUsers.length / usersPerPage)}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {role === 'user' && (
          <div className="profile-section">
            <h3>Your Profile</h3>
            <div className="profile-card">
              <img
                src="https://cdn.vectorstock.com/i/500p/53/42/user-member-avatar-face-profile-icon-vector-22965342.jpg"
                alt="User Avatar"
              />
              <div className="profile-info">
                <p className="profile-name">{userInfo.name || 'User Name'}</p>
                <p>{userInfo.email || 'Email not available'}</p>
                <p>{userInfo.role ? `Role: ${userInfo.role}` : 'Role not specified'}</p>
              </div>
              <div className="profile-actions">
                <button>Edit Profile</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
