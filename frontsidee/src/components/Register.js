import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Registertion.css';
import { FaUser, FaUserCircle, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUserTie } from 'react-icons/fa';
import registerImage from './login.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const [fullname, setFullname] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState('');
  const [role, setRole] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/;

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    if (!passwordRegex.test(value)) {
      setPasswordError(
        'Password must be at least 8 characters long, include an uppercase letter, a number, and a special character.'
      );
    } else {
      setPasswordError('');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!passwordRegex.test(password)) {
      toast.error(
        'Password must be at least 8 characters long, include an uppercase letter, a number, and a special character.',
        { autoClose: 1000 }
      );
      return;
    }

    if (password.trim() !== confirmPassword.trim()) {
      toast.error('Passwords do not match.', { autoClose: 1000 });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:4000/api/users/register', {
        fullname,
        username,
        email,
        password,
        confirmPassword,
        role,
        gender,
      });

      toast.success('Registration Successful: ' + response.data.message, { autoClose: 5000 });
      navigate('/');
    } catch (error) {
      if (error.response?.data?.message.includes('email') || error.response?.data?.message.includes('username')) {
        toast.error('Error: ' + error.response?.data?.message, { autoClose: 1000 });
      } else {
        toast.error('An error occurred: ' + (error.response?.data?.message || 'Something went wrong'), {
          autoClose: 1000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <ToastContainer position="top-right" />
      <div className="register-card">
        <div className="register-image">
          <img src={registerImage} alt="Welcome" />
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="register-header">
            <h2>Create Account</h2>
            <p>Sign up to get started</p>
          </div>

          <div className="form-control">
            <div className="input-wrapper">
              <FaUserCircle className="input-icon" />
              <input
                type="text"
                id="fullname"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
          </div>

          <div className="form-control">
            <div className="input-wrapper">
              <FaUser className="input-icon" />
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </div>
          </div>

          <div className="form-control">
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

          <div className="form-control">
            <div className="input-wrapper">
              <FaLock className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter your password"
                required
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <div className="form-control">
            <div className="input-wrapper">
              <FaLock className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <div className="form-control">
            <div className="input-wrapper">
              <FaUserTie className="input-icon" />
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select your role
                </option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
