import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import auth from './auth.js'; // Integrasi auth.js untuk login/register

const app = express();
const PORT = process.env.PORT || 3002;
const DATA_DIR = path.join(process.cwd(), 'data');

// Middleware
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/api/auth', auth); // Route untuk auth (login/register)

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// JSON File Operations
async function readJsonFile(filename) {
  try {
    const filePath = path.join(DATA_DIR, filename);
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return [];
  }
}

async function writeJsonFile(filename, data) {
  try {
    const filePath = path.join(DATA_DIR, filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    return false;
  }
}

// Health Check Routes
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'GoTripGoEat API is running', 
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'GoTripGoEat API is running', 
    timestamp: new Date().toISOString()
  });
});

// Schools Routes
app.get('/api/schools', async (req, res) => {
  console.log('Received GET /api/schools');
  try {
    const schools = await readJsonFile('schools.json');
    if (schools.length === 0) {
      console.log('No schools found, returning empty array');
    }
    res.json(schools);
  } catch (error) {
    console.error('Error fetching schools:', error);
    res.status(500).json({ error: 'Failed to fetch schools' });
  }
});

app.post('/api/schools', async (req, res) => {
  console.log('Received POST /api/schools', req.body);
  try {
    const schools = await readJsonFile('schools.json');
    const newSchool = {
      id: Date.now(),
      ...req.body,
      students: req.body.students || 0,
      canteens: req.body.canteens || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    schools.unshift(newSchool);
    const success = await writeJsonFile('schools.json', schools);
    
    if (success) {
      res.status(201).json(newSchool);
    } else {
      res.status(500).json({ error: 'Failed to save school' });
    }
  } catch (error) {
    console.error('Error creating school:', error);
    res.status(500).json({ error: 'Failed to create school' });
  }
});

app.put('/api/schools/:id', async (req, res) => {
  console.log('Received PUT /api/schools/:id', req.params.id, req.body);
  try {
    const schools = await readJsonFile('schools.json');
    const id = parseInt(req.params.id, 10);
    const index = schools.findIndex(s => s.id === id);
    if (index === -1) return res.status(404).json({ error: 'School not found' });

    schools[index] = { ...schools[index], ...req.body, updatedAt: new Date().toISOString() };
    const success = await writeJsonFile('schools.json', schools);

    if (success) {
      res.json(schools[index]);
    } else {
      res.status(500).json({ error: 'Failed to update school' });
    }
  } catch (error) {
    console.error('Error updating school:', error);
    res.status(500).json({ error: 'Failed to update school' });
  }
});

app.delete('/api/schools/:id', async (req, res) => {
  console.log('Received DELETE /api/schools/:id', req.params.id);
  try {
    const schools = await readJsonFile('schools.json');
    const id = parseInt(req.params.id, 10);
    const filtered = schools.filter(s => s.id !== id);
    const success = await writeJsonFile('schools.json', filtered);

    if (success) {
      res.json({ success: true });
    } else {
      res.status(500).json({ error: 'Failed to delete school' });
    }
  } catch (error) {
    console.error('Error deleting school:', error);
    res.status(500).json({ error: 'Failed to delete school' });
  }
});

// Users Routes
app.get('/api/users', async (req, res) => {
  console.log('Received GET /api/users');
  try {
    const users = await readJsonFile('users.json');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.post('/api/users', async (req, res) => {
  console.log('Received POST /api/users', req.body);
  try {
    const users = await readJsonFile('users.json');
    const newUser = {
      id: Date.now(),
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    users.unshift(newUser);
    const success = await writeJsonFile('users.json', users);
    if (success) {
      res.status(201).json(newUser);
    } else {
      res.status(500).json({ error: 'Failed to save user' });
    }
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

app.put('/api/users/:id', async (req, res) => {
  console.log('Received PUT /api/users/:id', req.params.id, req.body);
  try {
    const users = await readJsonFile('users.json');
    const id = parseInt(req.params.id, 10);
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return res.status(404).json({ error: 'User not found' });

    users[index] = { ...users[index], ...req.body, updatedAt: new Date().toISOString() };
    const success = await writeJsonFile('users.json', users);
    if (success) {
      res.json(users[index]);
    } else {
      res.status(500).json({ error: 'Failed to update user' });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  console.log('Received DELETE /api/users/:id', req.params.id);
  try {
    const users = await readJsonFile('users.json');
    const id = parseInt(req.params.id, 10);
    const filtered = users.filter(u => u.id !== id);
    const success = await writeJsonFile('users.json', filtered);
    if (success) {
      res.json({ success: true });
    } else {
      res.status(500).json({ error: 'Failed to delete user' });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Sellers Routes
app.get('/api/sellers', async (req, res) => {
  console.log('Received GET /api/sellers');
  try {
    const sellers = await readJsonFile('sellers.json');
    res.json(sellers);
  } catch (error) {
    console.error('Error fetching sellers:', error);
    res.status(500).json({ error: 'Failed to fetch sellers' });
  }
});

app.post('/api/sellers', async (req, res) => {
  console.log('Received POST /api/sellers', req.body);
  try {
    const sellers = await readJsonFile('sellers.json');
    const newSeller = {
      id: Date.now(),
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    sellers.unshift(newSeller);
    const success = await writeJsonFile('sellers.json', sellers);
    if (success) {
      res.status(201).json(newSeller);
    } else {
      res.status(500).json({ error: 'Failed to save seller' });
    }
  } catch (error) {
    console.error('Error creating seller:', error);
    res.status(500).json({ error: 'Failed to create seller' });
  }
});

app.put('/api/sellers/:id', async (req, res) => {
  console.log('Received PUT /api/sellers/:id', req.params.id, req.body);
  try {
    const sellers = await readJsonFile('sellers.json');
    const id = parseInt(req.params.id, 10);
    const index = sellers.findIndex(s => s.id === id);
    if (index === -1) return res.status(404).json({ error: 'Seller not found' });

    sellers[index] = { ...sellers[index], ...req.body, updatedAt: new Date().toISOString() };
    const success = await writeJsonFile('sellers.json', sellers);
    if (success) {
      res.json(sellers[index]);
    } else {
      res.status(500).json({ error: 'Failed to update seller' });
    }
  } catch (error) {
    console.error('Error updating seller:', error);
    res.status(500).json({ error: 'Failed to update seller' });
  }
});

app.delete('/api/sellers/:id', async (req, res) => {
  console.log('Received DELETE /api/sellers/:id', req.params.id);
  try {
    const sellers = await readJsonFile('sellers.json');
    const id = parseInt(req.params.id, 10);
    const filtered = sellers.filter(s => s.id !== id);
    const success = await writeJsonFile('sellers.json', filtered);
    if (success) {
      res.json({ success: true });
    } else {
      res.status(500).json({ error: 'Failed to delete seller' });
    }
  } catch (error) {
    console.error('Error deleting seller:', error);
    res.status(500).json({ error: 'Failed to delete seller' });
  }
});

// Orders Routes
app.get('/api/orders', async (req, res) => {
  console.log('Received GET /api/orders');
  try {
    const orders = await readJsonFile('orders.json');
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.post('/api/orders', async (req, res) => {
  console.log('Received POST /api/orders', req.body);
  try {
    const orders = await readJsonFile('orders.json');
    const newOrder = {
      id: Date.now(),
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    orders.unshift(newOrder);
    const success = await writeJsonFile('orders.json', orders);
    if (success) {
      res.status(201).json(newOrder);
    } else {
      res.status(500).json({ error: 'Failed to save order' });
    }
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

app.put('/api/orders/:id', async (req, res) => {
  console.log('Received PUT /api/orders/:id', req.params.id, req.body);
  try {
    const orders = await readJsonFile('orders.json');
    const id = parseInt(req.params.id, 10);
    const index = orders.findIndex(o => o.id === id);
    if (index === -1) return res.status(404).json({ error: 'Order not found' });

    orders[index] = { ...orders[index], ...req.body, updatedAt: new Date().toISOString() };
    const success = await writeJsonFile('orders.json', orders);
    if (success) {
      res.json(orders[index]);
    } else {
      res.status(500).json({ error: 'Failed to update order' });
    }
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

app.delete('/api/orders/:id', async (req, res) => {
  console.log('Received DELETE /api/orders/:id', req.params.id);
  try {
    const orders = await readJsonFile('orders.json');
    const id = parseInt(req.params.id, 10);
    const filtered = orders.filter(o => o.id !== id);
    const success = await writeJsonFile('orders.json', filtered);
    if (success) {
      res.json({ success: true });
    } else {
      res.status(500).json({ error: 'Failed to delete order' });
    }
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

// Initialize data
async function initializeData() {
  await ensureDataDir();
  
  const files = ['schools.json', 'users.json', 'sellers.json', 'orders.json'];
  
  for (const file of files) {
    try {
      await fs.access(path.join(DATA_DIR, file));
    } catch {
      console.log(`Creating ${file}...`);
      const emptyData = [];
      await writeJsonFile(file, emptyData);
    }
  }
}

// Start server
const startServer = async () => {
  try {
    await initializeData();
    console.log('🚀 GoTripGoEat API Server v1.0.0');
    console.log('📡 Running on http://localhost:' + PORT);
    console.log('🌐 Health check: http://localhost:' + PORT + '/');
    console.log('📁 Data directory:', DATA_DIR);
    
    console.log('\n📋 Available API Routes:');
    console.log('  GET/POST/PUT/DELETE /api/schools - CRUD schools');
    console.log('  GET/POST/PUT/DELETE /api/sellers - CRUD sellers');
    console.log('  GET/POST/PUT/DELETE /api/users - CRUD users');
    console.log('  GET/POST/PUT/DELETE /api/orders - CRUD orders');
    console.log('  GET / - Health check');
    console.log('  GET /api/health - Health check');
    console.log('  POST /api/auth/login - Login');
    console.log('  POST /api/auth/register - Register');
    
    console.log('\n💡 CORS enabled for: localhost:8080, 3000, 5173');
    
    app.listen(PORT, () => {
      console.log(`\n✅ Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();