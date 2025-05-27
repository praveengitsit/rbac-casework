const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001;
const JWT_SECRET = 'itonics-case-study';
const HASH_FACTOR = 10;

app.use(cors({
  origin: 'http://localhost:4200'
}));
app.use(express.json());

const dbPath = path.join(__dirname, 'db.json');

const readDb = () => {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading db.json:', error);
    return { users: [], roles: [], permissions: [] };
  }
};

const writeDb = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.get("/:universalURL", (req, res) => {
   res.send("404 URL NOT FOUND");
});


app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const db = readDb();

  const user = db.users.find(u => u.username === username);

  if (user && bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign({ userId: user.id, username: user.username, roleId: user.roleId }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ accessToken: token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.get('/protected/users', authenticateToken, (req, res) => {
  const db = readDb();
  res.json(db.users);
});

app.get('/public/roles', (req, res) => {
  const db = readDb();
  res.json(db.roles);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

