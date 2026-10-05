const bcrypt = require('bcryptjs');
const { initDb, getDbWrapper } = require('./src/config/db');

async function createAdmin() {
  try {
    await initDb();

    const db = getDbWrapper();

    const name = 'Raj Admin';
    const email = 'raj.admin@bloodconnect.com';
    const password = 'RajAdmin@123';
    const role = 'admin';

    // Check if account already exists
    const existing = db.query(
      'SELECT id, email FROM users WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      console.log('Admin account already exists:', existing[0]);
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = db.run(
      `INSERT INTO users
       (name, email, password_hash, role, is_active)
       VALUES (?, ?, ?, ?, ?)`,
      [name, email, passwordHash, role, 1]
    );

    console.log('');
    console.log('================================');
    console.log('NEW ADMIN CREATED SUCCESSFULLY');
    console.log('================================');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Role:', role);
    console.log('User ID:', result.lastInsertRowid);
    console.log('================================');

  } catch (error) {
    console.error('ERROR:', error);
  }
}

createAdmin();
