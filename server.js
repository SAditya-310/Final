import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT)
});

db.connect((err) => {
  if (err) {
    console.error('DB connection error:', err);
    return;
  }
  console.log('Connected to MySQL database');
});
app.post('/signup', (req, res) => {
  const { name, email, role, password } = req.body;

  if (!name || !email || !role || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  const [firstName, ...rest] = name.trim().split(' ');
  const lastName = rest.join(' ');
  const query = 'INSERT INTO users (name, email, role, password) VALUES (?, ?, ?, ?)';
  db.query(query, [name, email, role, password], (err, result) => {
    if (err) {
      console.error('SQL Error:', err);
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: 'Email already exists' });
      }
      return res.status(500).json({ message: err.message });
    }

    // Return user object compatibl e with frontend
    const user = { id: result.insertId, firstName, lastName, name, email, role, points: 0 };
    res.json({ message: 'Signup successful', user });
  });
});
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }
  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('SQL Error:', err);
      return res.status(500).json({ message: err.message });
    }
    if (results.length > 0) {
      const userRow = results[0];
      const [firstName, ...rest] = userRow.name.trim().split(' ');
      const lastName = rest.join(' ');
      const user = {
        id: userRow.id,
        firstName,
        lastName,
        name: userRow.name,
        email: userRow.email,
        role: userRow.role,
        points: userRow.points || 0
      };
      res.json({ message: 'Login successful', user });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  });
});

// Test route
app.get('/', (req, res) => {
  res.send('Node.js backend is running!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});