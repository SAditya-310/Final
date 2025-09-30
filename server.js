import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory storage for users (replaces MySQL)
let users = [];
let nextUserId = 1;

// Helper function to find user by email
const findUserByEmail = (email) => {
  return users.find(user => user.email === email);
};

app.post('/signup', (req, res) => {
  const { name, email, role, password } = req.body;

  if (!name || !email || !role || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Check if user already exists
  if (findUserByEmail(email)) {
    return res.status(400).json({ message: 'Email already exists' });
  }

  const [firstName, ...rest] = name.trim().split(' ');
  const lastName = rest.join(' ');

  // Create new user
  const newUser = {
    id: nextUserId++,
    name,
    email,
    role,
    password,
    points: 0,
    created_at: new Date().toISOString()
  };

  users.push(newUser);

  // Return user object compatible with frontend
  const user = { 
    id: newUser.id, 
    firstName, 
    lastName, 
    name, 
    email, 
    role, 
    points: 0 
  };

  res.json({ message: 'Signup successful', user });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }

  const userRow = findUserByEmail(email);

  if (userRow && userRow.password === password) {
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

// Test route
app.get('/', (req, res) => {
  res.send('Node.js backend is running!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Using in-memory storage for user data');
});