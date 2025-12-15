const fs = require('fs');
const path = require('path');
const db = require('../config/db');
const bcrypt = require('bcryptjs');

const migrate = async () => {
  try {
    const sqlPath = path.join(__dirname, '..', 'database.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('Running migrations...');
    await db.query(sql);
    console.log('Tables created and initial data seeded.');

    // Create default admin user if not exists
    const adminEmail = 'admin@wagnou.com';
    const adminPassword = 'admin'; // Change this in production!

    const userCheck = await db.query('SELECT * FROM users WHERE email = $1', [adminEmail]);

    if (userCheck.rows.length === 0) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);

      await db.query('INSERT INTO users (email, password_hash) VALUES ($1, $2)', [adminEmail, hashedPassword]);
      console.log(`Default admin user created: ${adminEmail} / ${adminPassword}`);
    } else {
      console.log('Admin user already exists.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrate();
