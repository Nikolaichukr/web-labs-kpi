const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken'); // JWT бібліотека
const cors = require('cors'); // біліотека для CORS (cross-origin requests)

const app = express();
const PORT = process.env.PORT || 3001;
const secretKey = 'my-super-secret-key'; // Секретний ключ

app.use(cors()); // Вмикаємо CORS 
app.use(bodyParser.json());

// Імітація бази даних
const users = [
  { id: 1, username: 'admin', password: 'admin123', role: 'admin' },
  { id: 2, username: 'user', password: 'user123', role: 'user' },
];

// Обробник /login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Симуляція запиту до бази даних
  const user = users.find((user) => user.username === username && user.password === password);

  if (user) {
    // Створюємо та підписуємо JWT
    const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });

    res.json({ token, user });
  } else {
    res.status(401).json({ message: 'Access denied' });
  }
});

// Роут для валідації JWT
app.get('/verify-token', (req, res) => {
  const token = req.headers.authorization;

  // Якщо токена немає
  if (!token) {
    return res.status(401).json({ message: 'Access denied' });
  }

  // Безпосередньо валідація
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Access denied' });
    }

    // Якщо токен валідний - повертаємо дані
    const user = users.find((user) => user.id === decoded.userId);
    res.json({ user });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
