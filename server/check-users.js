const dbModule = require('./src/config/db');

async function checkUsers() {
  try {
    await dbModule.initDb();

    const db = dbModule.getDbWrapper();

    console.log('\n=== USERS IN DATABASE ===');

    const result = await db.query(
      'SELECT id, name, email, role, is_active FROM users'
    );

    console.log(result);

  } catch (error) {
    console.error('Database check failed:', error);
  }
}

checkUsers();
