import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

// Форма входу
const LoginForm = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Перевіряємо чи присутній токен в local storage
    const token = localStorage.getItem('token');
    if (token) {
      // Якщо присутній, то відправляємо запит на його перевірку
      axios.get('/verify-token', { headers: { Authorization: token } })
        .then((response) => {
          setUser(response.data.user);
        })
        .catch(() => {
          // Якщо токен невалідний - видаляємо його
          localStorage.removeItem('token');
        });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Обробка виходу
  const handleLogout = () => {
    // При виході з профілю видаляємо токен
    setUser(null);
    localStorage.removeItem('token');
  };

  // Обробка відправки форми
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Пробуємо відправити дані для входу на /login
      const response = await axios.post('/login', formData);
      const { token, user } = response.data;

      // Зберігаємо токен і встановлюємо користувача
      localStorage.setItem('token', token);
      setUser(user);
      setError('');
    } catch (err) { // Якщо сталась помилка (дані невалідні - виводимо помилку)
      setError('Access denied. Please check your credentials.');
    }
  };

  // Якщо користувач золгінився успішно - виводимо сторінку з його даними
  if (user) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Paper elevation={3} style={{ padding: '20px', textAlign: 'center', maxWidth: '400px' }}>
          <Typography variant="h4">Welcome, {user.username}!</Typography>
          <div style={{ margin: '20px 0' }}>
            <Typography variant="body1">User Info:</Typography>
            <pre style={{ whiteSpace: 'pre-wrap', textAlign: 'left' }}>{JSON.stringify(user, null, 2)}</pre>
          </div>
          <Button variant="contained" color="primary" onClick={handleLogout}>
            Logout
          </Button>
        </Paper>
      </div>
    );
  }

  // Якщо користувач не залогінився - виводимо сторінку входу
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <TextField type="text" name="username" label="Username" variant="outlined" fullWidth margin="normal" onChange={handleChange} />
          <TextField type="password" name="password" label="Password" variant="outlined" fullWidth margin="normal" onChange={handleChange} />
          <Button type="submit" variant="contained" color="primary">
            Login
          </Button>
        </form>
        {error && <p>{error}</p>}
      </div>
    </div>
  );
};

export default LoginForm;
