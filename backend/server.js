const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3001;
const SECRET_KEY = process.env.JWT_SECRET || 'wagnou_secret_key_simple';

app.use(cors());
app.use(bodyParser.json());

// Health Check & DB Test
app.get('/api/health', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({
      status: 'ok',
      timestamp: new Date(),
      db_time: result.rows[0].now
    });
  } catch (error) {
    console.error('DB Connection Error:', error);
    res.status(500).json({ status: 'error', message: 'Database connection failed' });
  }
});

// --- ROUTES ---

// GET Products
app.get('/api/products', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM products ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lecture produits' });
  }
});

// GET Astuces
app.get('/api/astuces', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM astuces ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lecture astuces' });
  }
});

// POST Order (Mock)
app.post('/api/order', (req, res) => {
  console.log('Nouvelle commande reçue:', req.body);
  // Here you would save to DB or send email
  res.json({ success: true, message: 'Commande reçue avec succès !' });
});

// POST Contact (Mock)
app.post('/api/contact', (req, res) => {
  console.log('Nouveau message:', req.body);
  res.json({ success: true, message: 'Message envoyé !' });
});

// POST Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Identifiants incorrects' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (isMatch) {
      const token = jwt.sign({ id: user.id, role: 'admin' }, SECRET_KEY, { expiresIn: '24h' });
      res.json({ success: true, token });
    } else {
      res.status(401).json({ success: false, message: 'Identifiants incorrects' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// GET Dashboard Stats
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const productsCount = await db.query('SELECT COUNT(*) FROM products');
    const astucesCount = await db.query('SELECT COUNT(*) FROM astuces');

    res.json({
      productsCount: parseInt(productsCount.rows[0].count),
      astucesCount: parseInt(astucesCount.rows[0].count),
      ordersCount: 0 // Mock for now
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur stats' });
  }
});

// --- ADMIN ROUTES (Simplified) ---

// POST Product (Protected)
app.post('/api/products', async (req, res) => {
  // TODO: Add middleware to verify token
  const { name, category, description, price, image } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO products (name, category, description, price, image) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, category, description, price, image]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur création produit' });
  }
});

// DELETE Product (Protected)
app.delete('/api/products/:id', async (req, res) => {
  // TODO: Add middleware to verify token
  const { id } = req.params;
  try {
    await db.query('DELETE FROM products WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur suppression produit' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
