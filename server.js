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



// Helper function to read the database
async function readDatabase() {
  try {
    const data = await fs.readFile(dbFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
   return { users: [], roles: [], permissions: [] };// Ensure we return an object with a roles array
  }
}

// Helper function to write to the database
async function writeDatabase(data) {
  try {
    await fs.writeFile(dbFilePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing to database:', error);
    return false;
  }
}

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

// Auth starts here

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const db = readDatabase();

  const user = db.users.find(u => u.username === username);

  if (user && bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign({ username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ accessToken: token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});



// Auth ends here here

// User management starts here

app.get('/protected/users', authenticateToken, (req, res) => {
  const db = readDatabase();
  res.json(db.users);
});

// User managements ends here

// Role management starts here
// GET /api/roles - Get all roles
app.get('/api/roles', authenticateToken, async (req, res) => {
  const data = await readDatabase();
  res.json(data.roles || []);
});

// GET /api/roles/:name - Get a specific role by name
app.get('/api/roles/:name', authenticateToken, async (req, res) => {
  const roleName = req.params.name;
  const data = await readDatabase();
  const roles = data.roles || [];
  const role = roles.find(r => r.name === roleName);

  if (role) {
    res.json(role);
  } else {
    res.status(404).send('Role not found');
  }
});

// POST /api/roles - Add a new role
app.post('/api/roles', authenticateToken, async (req, res) => {
  const newRole = req.body;
  const data = await readDatabase();
  data.roles = data.roles || [];

  if (data.roles.some(role => role.name === newRole.name)) {
    return res.status(409).send('Role name already exists');
  }

  data.roles.push(newRole);
  const success = await writeDatabase(data);
  if (success) {
    res.status(201).json(newRole);
  } else {
    res.status(500).send('Failed to add role.');
  }
});

// PUT /api/roles/:name - Edit an existing role
app.put('/api/roles/:name', authenticateToken, async (req, res) => {
  const roleNameToEdit = req.params.name;
  const updatedRole = req.body;
  const data = await readDatabase();
  let roles = data.roles || [];
  const roleIndex = roles.findIndex(r => r.name === roleNameToEdit);

  if (roleIndex !== -1) {
    roles[roleIndex] = { ...roles[roleIndex], ...updatedRole };
    const success = await writeDatabase(data);
    if (success) {
      res.json(roles[roleIndex]);
    } else {
      res.status(500).send('Failed to update role.');
    }
  } else {
    res.status(404).send('Role not found');
  }
});

// DELETE /api/roles/:name - Delete a role
app.delete('/api/roles/:name', authenticateToken, async (req, res) => {
  const roleNameToDelete = req.params.name;
  const data = await readDatabase();
  let roles = data.roles || [];
  const initialLength = roles.length;
  roles = roles.filter(r => r.name !== roleNameToDelete);

  if (roles.length < initialLength) {
    data.roles = roles;
    const success = await writeDatabase(data);
    if (success) {
      res.status(200).send('Role deleted successfully');
    } else {
      res.status(500).send('Failed to delete role.');
    }
  } else {
    res.status(404).send('Role not found');
  }
});
// Role management ends here

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

