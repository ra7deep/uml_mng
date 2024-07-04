import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../css/LoginPage.module.css'; // Import CSS module

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  console.log('API URL:', process.env.REACT_APP_API_URL);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/auth/login', { username, password });
      const data = response.data;
      console.log(data);
      if (data.success) {
        if (data.user.role === 'user') {
          navigate('/user/dashboard', { state: { user: data.user } });
        } else if (data.user.role === 'admin') {
          navigate('/admin/dashboard', { state: { user: data.user } });
        }
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <img src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Logo_UshaMartin.png" alt="Logo" className={styles.loginLogo} />
        <h2 className={styles.heading}>Login</h2>
        <form onSubmit={handleLogin}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className={styles.input}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className={styles.input}
              required
            />
          </div>
          {error && <p className={styles.errorMessage}>{error}</p>}
          <button type="submit" className={styles.button}>Login</button>
          <a href="/auth/forgot-password" className={styles.link}>Forgot Password?</a>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
