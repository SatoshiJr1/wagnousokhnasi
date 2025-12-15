const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('./config/db');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const SECRET_KEY = process.env.JWT_SECRET || 'wagnou_secret_key_simple';

// Ensure images directory exists
const UPLOAD_DIR = path.join(__dirname, 'images');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Configure Multer (Memory Storage for processing)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // Support form-data

// Helper to process and save image
const processAndSaveImage = async (fileBuffer) => {
  const filename = `img-${Date.now()}-${Math.round(Math.random() * 1E9)}.webp`;
  const filepath = path.join(UPLOAD_DIR, filename);
  
  await sharp(fileBuffer)
    .resize(800, 800, { fit: 'inside', withoutEnlargement: true }) // Resize max 800px
    .webp({ quality: 80 }) // Compress to WebP
    .toFile(filepath);
    
  return `https://assets.nexteranga.com/${filename}`;
};

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

// Middleware d'authentification
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

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

// GET Users (Protected)
app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    const result = await db.query('SELECT id, email, created_at FROM users ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lecture utilisateurs' });
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
app.get('/api/dashboard/stats', authenticateToken, async (req, res) => {
  try {
    const productsCount = await db.query('SELECT COUNT(*) FROM products');
    const astucesCount = await db.query('SELECT COUNT(*) FROM astuces');
    const usersCount = await db.query('SELECT COUNT(*) FROM users');

    res.json({
      productsCount: parseInt(productsCount.rows[0].count),
      astucesCount: parseInt(astucesCount.rows[0].count),
      usersCount: parseInt(usersCount.rows[0].count),
      ordersCount: 0 // Mock for now
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur stats' });
  }
});

// --- ADMIN ROUTES (Protected) ---

// --- PRODUCTS ---

// POST Product
app.post('/api/products', authenticateToken, upload.single('image'), async (req, res) => {
  const { name, category, description, price } = req.body;
  let imageUrl = req.body.image; // Fallback if URL provided directly

  try {
    if (req.file) {
      imageUrl = await processAndSaveImage(req.file.buffer);
    }

    const result = await db.query(
      'INSERT INTO products (name, category, description, price, image) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, category, description || null, price, imageUrl || null]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur création produit' });
  }
});

// PUT Product
app.put('/api/products/:id', authenticateToken, upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { name, category, description, price } = req.body;
  let imageUrl = req.body.image;

  try {
    if (req.file) {
      imageUrl = await processAndSaveImage(req.file.buffer);
    }

    const result = await db.query(
      'UPDATE products SET name = $1, category = $2, description = $3, price = $4, image = $5 WHERE id = $6 RETURNING *',
      [name, category, description || null, price, imageUrl || null, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur modification produit' });
  }
});

// DELETE Product
app.delete('/api/products/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {upload.single('image'), async (req, res) => {
  const { title, content } = req.body;
  let imageUrl = req.body.image;

  try {
    if (req.file) {
      imageUrl = await processAndSaveImage(req.file.buffer);
    }

    const result = await db.query(
      'INSERT INTO astuces (title, content, image) VALUES ($1, $2, $3) RETURNING *',
      [title, content, imageUrl || null]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur création astuce' });
  }
});

// PUT Astuce
app.put('/api/astuces/:id', authenticateToken, upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  let imageUrl = req.body.image;

  try {
    if (req.file) {
      imageUrl = await processAndSaveImage(req.file.buffer);
    }

    const result = await db.query(
      'UPDATE astuces SET title = $1, content = $2, image = $3 WHERE id = $4 RETURNING *',
      [title, content, imageUrl
    res.status(500).json({ error: 'Erreur création astuce' });
  }
});

// PUT Astuce
app.put('/api/astuces/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, content, image } = req.body;
  try {
    const result = await db.query(
      'UPDATE astuces SET title = $1, content = $2, image = $3 WHERE id = $4 RETURNING *',
      [title, content, image || null, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Astuce non trouvée' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur modification astuce' });
  }
});

// DELETE Astuce
app.delete('/api/astuces/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM astuces WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur suppression astuce' });
  }
});

// --- USERS ---

// POST User
app.post('/api/users', authenticateToken, async (req, res) => {
  const { email, password } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const result = await db.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at',
      [email, hash]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur création utilisateur' });
  }
});

// PUT User (Password only for simplicity)
app.put('/api/users/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;
  try {
    if (!password) {
      // If no password provided, just return the user info without updating
      const existing = await db.query('SELECT id, email, created_at FROM users WHERE id = $1', [id]);
      if (existing.rows.length === 0) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }
      return res.json(existing.rows[0]);
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const result = await db.query(
      'UPDATE users SET password_hash = $1 WHERE id = $2 RETURNING id, email',
      [hash, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur modification utilisateur' });
  }
});

// DELETE User
app.delete('/api/users/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  // Prevent deleting self if needed, but for now simple
  try {
    await db.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur suppression utilisateur' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
