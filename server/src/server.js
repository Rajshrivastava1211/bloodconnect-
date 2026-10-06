require('dotenv').config();
const { initDb } = require('./config/db');
const app = require('./app');

const PORT = process.env.PORT || 5001;

async function startServer() {
  try {
    console.log('[Server] Initializing database...');
    await initDb();
    console.log('[Server] Database ready.');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`[Server] BloodConnect API running on port ${PORT}`);
      console.log(`[Server] Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (err) {
    console.error('[Server] Failed to start:', err);
    process.exit(1);
  }
}

startServer();