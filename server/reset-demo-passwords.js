const bcrypt = require('bcryptjs');
const { initDb, getDbWrapper } = require('./src/config/db');

async function resetPasswords() {
  try {
    console.log('Initializing database...');

    await initDb();

    const db = getDbWrapper();

    const password = 'BloodConnect@123';
    const hash = await bcrypt.hash(password, 10);

    const emails = [
      'admin@bloodconnect.com',
      'organizer@bloodconnect.com',
      'donor@bloodconnect.com'
    ];

    for (const email of emails) {
      db.run(
        'UPDATE users SET password_hash = ? WHERE email = ?',
        [hash, email]
      );

      console.log(`Password reset: ${email}`);
    }

    console.log('');
    console.log('All demo passwords are now: BloodConnect@123');
    console.log('Done!');
  } catch (error) {
    console.error('ERROR:', error);
  }
}

resetPasswords();