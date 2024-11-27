import React, { useState } from 'react';
import axios from 'axios';
import './login.css';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import login from './login.png';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      toast.dismiss();

      const response = await axios.post(
        'http://localhost:4000/api/users/login',
        { email, password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success('Login successful!', { autoClose: 1000 });

        setEmail('');
        setPassword('');

        localStorage.setItem('token', response.data.token);

        navigate('/Dashboard');
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message, { autoClose: 1000 });
      } else {
        toast.error('An error occurred. Please try again later.', { autoClose: 1000 });
      }
    }
  };

  return (
    <div className="login-container">
      <ToastContainer position="top-right" />

      <div className="login-card">
        <div className="login-image">
          <img src={login} alt="Welcome" />
        </div>

        <div className="login-form">
          <div className="login-header">
            <h2>Welcome</h2>
            <p>Login to your account</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <div className="input-wrapper">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-wrapper">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button type="submit" className="submit-btn">
              Login
            </button>

            <p className="signup-text">
              Don't have an account? <a href="/register">Sign up</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
