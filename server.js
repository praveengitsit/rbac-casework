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
   const data = await fs.promises.readFile(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
   return { users: [], roles: [], permissions: [] };// Ensure we return an object with a roles array
  }
}

// Helper function to write to the database
async function writeDatabase(data) {
  try {
   await fs.promises.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf8');
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

// Auth starts here

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const db = await readDatabase();

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

// User API management starts here

// GET /api/users - Get all users
app.get('/api/users', authenticateToken, async (req, res) => {
  const data = await readDatabase();
  // Return users without their passwords
  const users = (data.users || []).map(user => {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });
  res.json(users);
});

// GET /api/users/:username - Get a specific user by username
app.get('/api/users/:username', authenticateToken, async (req, res) => {
  const username = req.params.username;
  const data = await readDatabase();
  const users = data.users || [];
  const user = users.find(u => u.username === username);

  if (user) {
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } else {
    res.status(404).send('User not found');
  }
});

// POST /api/users - Add a new user
app.post('/api/users', authenticateToken, async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password || !role) {
    return res.status(400).send('Username, password, and role are required.');
  }

  const data = await readDatabase();
  data.users = data.users || [];

  if (data.users.some(user => user.username === username)) {
    return res.status(409).send('Username already exists');
  }

  const hashedPassword = await bcrypt.hash(password, HASH_FACTOR);
  const newUser = { username, password: hashedPassword, role };
  data.users.push(newUser);

  const success = await writeDatabase(data);
  if (success) {
    const { password, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);
  } else {
    res.status(500).send('Failed to add user.');
  }
});

// PUT /api/users/:username - Edit an existing user
app.put('/api/users/:username', authenticateToken, async (req, res) => {
  const usernameToEdit = req.params.username;
  const updatedUserData = req.body;
  const data = await readDatabase();
  let users = data.users || [];
  const userIndex = users.findIndex(u => u.username === usernameToEdit);

  if (userIndex !== -1) {
    // If username is being changed, check for conflicts
    if (updatedUserData.username && updatedUserData.username !== usernameToEdit) {
      if (users.some(u => u.username === updatedUserData.username)) {
        return res.status(409).send('New username already exists');
      }
    }

    // If password is provided, hash it
    if (updatedUserData.password) {
      updatedUserData.password = await bcrypt.hash(updatedUserData.password, HASH_FACTOR);
    }

    users[userIndex] = { ...users[userIndex], ...updatedUserData };
    data.users = users; // Ensure the main data object is updated
    const success = await writeDatabase(data);
    if (success) {
      const { password, ...userWithoutPassword } = users[userIndex];
      res.json(userWithoutPassword);
    } else {
      res.status(500).send('Failed to update user.');
    }
  } else {
    res.status(404).send('User not found');
  }
});

// DELETE /api/users/:username - Delete a user
app.delete('/api/users/:username', authenticateToken, async (req, res) => {
  const usernameToDelete = req.params.username;
  const data = await readDatabase();
  let users = data.users || [];
  const initialLength = users.length;
  users = users.filter(u => u.username !== usernameToDelete);

  if (users.length < initialLength) {
    data.users = users;
    const success = await writeDatabase(data);
    if (success) {
      res.status(200).send('User deleted successfully');
    } else {
      res.status(500).send('Failed to delete user.');
    }
  } else {
    res.status(404).send('User not found');
  }
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

