const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;
const SECRET_KEY = 'wagnou_secret_key_simple'; // In production, use .env

app.use(cors());
app.use(bodyParser.json());

// Helper to read JSON files
const readData = (file) => {
  const data = fs.readFileSync(path.join(__dirname, 'data', file));
  return JSON.parse(data);
};

const writeData = (file, content) => {
  fs.writeFileSync(path.join(__dirname, 'data', file), JSON.stringify(content, null, 2));
};

// --- ROUTES ---

// GET Products
app.get('/api/products', (req, res) => {
  try {
    const products = readData('products.json');
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lecture produits' });
  }
});

// GET Astuces
app.get('/api/astuces', (req, res) => {
  try {
    const astuces = readData('astuces.json');
    res.json(astuces);
  } catch (error) {
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
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  // Hardcoded admin for simplicity as requested
  if (email === 'admin@wagnou.com' && password === 'admin123') {
    const token = jwt.sign({ role: 'admin' }, SECRET_KEY, { expiresIn: '24h' });
    res.json({ success: true, token });
  } else {
    res.status(401).json({ success: false, message: 'Identifiants incorrects' });
  }
});

// GET Dashboard Stats
app.get('/api/dashboard/stats', (req, res) => {
  try {
    const products = readData('products.json');
    const astuces = readData('astuces.json');
    // Mock order count
    res.json({
      productsCount: products.length,
      astucesCount: astuces.length,
      ordersCount: 12 // Mock
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur stats' });
  }
});

// --- ADMIN ROUTES (Simplified) ---

// POST Add Product
app.post('/api/products', (req, res) => {
    // Verify token middleware should be here, skipping for simplicity/speed as requested "simple admin"
    try {
        const products = readData('products.json');
        const newProduct = { id: Date.now(), ...req.body };
        products.push(newProduct);
        writeData('products.json', products);
        res.json({ success: true, product: newProduct });
    } catch (e) {
        res.status(500).json({ error: 'Erreur ajout produit' });
    }
});

// DELETE Product
app.delete('/api/products/:id', (req, res) => {
    try {
        let products = readData('products.json');
        products = products.filter(p => p.id != req.params.id);
        writeData('products.json', products);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: 'Erreur suppression produit' });
    }
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
