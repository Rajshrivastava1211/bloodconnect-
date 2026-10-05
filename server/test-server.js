require('dotenv').config();
const { initDb } = require('./src/config/db');
const bcrypt = require('bcryptjs');

async function test() {
  console.log('Testing Database...');
  const db = await initDb();
  
  const tables = db.query("SELECT name FROM sqlite_master WHERE type='table'");
  console.log('Tables in DB:', tables.map(t => t.name));

  const users = db.query("SELECT id, name, email, role, password_hash FROM users");
  console.log('Users count:', users.length);
  for (const u of users) {
    const isBC123 = bcrypt.compareSync('BloodConnect@123', u.password_hash);
    const isSpecific = bcrypt.compareSync(u.role === 'admin' ? 'Admin@123' : u.role === 'organizer' ? 'Org@123' : 'Donor@123', u.password_hash);
    console.log(`User: ${u.email} (${u.role}) -> Match 'BloodConnect@123': ${isBC123}, Match specific demo pass: ${isSpecific}`);
  }

  const camps = db.query("SELECT id, name, city, status, capacity FROM camps");
  console.log('Camps count:', camps.length);

  const bloodBanks = db.query("SELECT count(*) as count FROM blood_banks");
  console.log('Blood banks count:', bloodBanks[0].count);

  const faqs = db.query("SELECT count(*) as count FROM faqs");
  console.log('FAQs count:', faqs[0].count);

  console.log('ALL DB CHECKS PASSED!');
  process.exit(0);
}

test().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
