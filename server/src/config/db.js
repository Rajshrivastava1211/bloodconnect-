const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');

const DB_PATH = path.resolve(process.env.SQLITE_PATH || './data/bloodconnect.db');
const DATA_DIR = path.dirname(DB_PATH);

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let db = null;

/** Persist in-memory SQLite database to disk */
function persistDb() {
  try {
    const data = db.export();
    fs.writeFileSync(DB_PATH, Buffer.from(data));
  } catch (err) {
    console.error('[DB] Error persisting database:', err.message);
  }
}

/**
 * Initialize the database: load from disk if exists, otherwise create fresh.
 * Returns a promise that resolves to a db wrapper object.
 */
async function initDb() {
  if (db) return getDbWrapper();

  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
    console.log('[DB] Loaded existing SQLite database from', DB_PATH);
  } else {
    db = new SQL.Database();
    console.log('[DB] Created new SQLite database at', DB_PATH);

    // Run schema
    const schemaPath = path.resolve(__dirname, '../../../database/schema.sql');
    if (fs.existsSync(schemaPath)) {
      const schema = fs.readFileSync(schemaPath, 'utf8');
      db.run(schema);
      console.log('[DB] Schema applied.');
    }

    // Run seed
    const seedPath = path.resolve(__dirname, '../../../database/seed.sql');
    if (fs.existsSync(seedPath)) {
      // Execute seed with real bcrypt hashes
      const bcrypt = require('bcryptjs');
      const hash = bcrypt.hashSync('BloodConnect@123', 10);

      const rawSeed = fs.readFileSync(seedPath, 'utf8');
      // Replace placeholder hash with actual bcrypt hash
      const seedSql = rawSeed.replace(
        /'\$2a\$10\$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyQSz7LH5'/g,
        `'${hash}'`
      );
      db.run(seedSql);
      console.log('[DB] Seed data applied. All demo passwords: BloodConnect@123');
    }

    persistDb();
  }

  // Persist to disk every 30 seconds for durability
  const persistInterval = setInterval(persistDb, 30000);
  if (persistInterval.unref) persistInterval.unref();

  return getDbWrapper();
}

/** Wrap sql.js API in a promise-based interface similar to mysql2 */
function getDbWrapper() {
  return {
    /**
     * Execute a query and return all rows as objects.
     * @param {string} sql
     * @param {Array} params
     * @returns {Array<Object>}
     */
    query(sql, params = []) {
      try {
        const stmt = db.prepare(sql);
        stmt.bind(params);
        const rows = [];
        while (stmt.step()) {
          rows.push(stmt.getAsObject());
        }
        stmt.free();
        persistDb();
        return rows;
      } catch (err) {
        console.error('[DB] Query error:', err.message, '\nSQL:', sql);
        throw err;
      }
    },

    /**
     * Execute a statement (INSERT/UPDATE/DELETE) and return info.
     * @param {string} sql
     * @param {Array} params
     * @returns {{ changes: number, lastInsertRowid: number }}
     */
    run(sql, params = []) {
      try {
        db.run(sql, params);
        const changes = db.getRowsModified();
        // Get last inserted rowid
        let lastInsertRowid = 0;
        try {
          const res = db.exec('SELECT last_insert_rowid() as id');
          if (res.length > 0 && res[0].values.length > 0) {
            lastInsertRowid = res[0].values[0][0];
          }
        } catch (e) {}
        persistDb();
        return { changes, lastInsertRowid };
      } catch (err) {
        console.error('[DB] Run error:', err.message, '\nSQL:', sql);
        throw err;
      }
    },

    /**
     * Execute a raw SQL string (for multi-statement scripts).
     */
    exec(sql) {
      try {
        db.exec(sql);
        persistDb();
      } catch (err) {
        console.error('[DB] Exec error:', err.message);
        throw err;
      }
    }
  };
}

module.exports = { initDb, getDbWrapper };
