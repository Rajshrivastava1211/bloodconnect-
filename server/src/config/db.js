const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');
const bcrypt = require('bcryptjs');

const DB_PATH = path.resolve(
  process.env.SQLITE_PATH || './data/bloodconnect.db'
);

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
 * Create or update the three demo accounts.
 * All demo accounts use:
 * Password: BloodConnect@123
 */
function ensureDemoAccounts() {
  const demoPasswordHash = bcrypt.hashSync('BloodConnect@123', 10);

  const demoAccounts = [
  {
    name: 'Admin BloodConnect',
    email: 'admin@bloodconnect.com',
    role: 'admin'
  },
  {
    name: 'Raj Admin',
    email: 'raj.admin@bloodconnect.com',
    role: 'admin'
  },
  {
    name: 'Red Cross Organizer',
    email: 'organizer@bloodconnect.com',
    role: 'organizer'
  },
  {
    name: 'Raj Shrivastava',
    email: 'donor@bloodconnect.com',
    role: 'donor'
  }
];

  for (const account of demoAccounts) {
    const existing = db.exec(
      `SELECT id FROM users WHERE email = '${account.email}'`
    );

    if (existing.length > 0 && existing[0].values.length > 0) {
      // Account exists — reset password and make sure it is active
      db.run(
        `UPDATE users
         SET name = ?,
             password_hash = ?,
             role = ?,
             is_active = 1,
             updated_at = CURRENT_TIMESTAMP
         WHERE email = ?`,
        [
          account.name,
          demoPasswordHash,
          account.role,
          account.email
        ]
      );

      console.log(`[DB] Demo account updated: ${account.email}`);
    } else {
      // Account does not exist — create it
      db.run(
        `INSERT INTO users
         (name, email, password_hash, role, is_active)
         VALUES (?, ?, ?, ?, 1)`,
        [
          account.name,
          account.email,
          demoPasswordHash,
          account.role
        ]
      );

      console.log(`[DB] Demo account created: ${account.email}`);
    }
  }

  persistDb();

  console.log(
    '[DB] Demo accounts ready. Password: BloodConnect@123'
  );
}

/**
 * Initialize the database
 */
async function initDb() {
  if (db) return getDbWrapper();

  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);

    console.log(
      '[DB] Loaded existing SQLite database from',
      DB_PATH
    );
  } else {
    db = new SQL.Database();

    console.log(
      '[DB] Created new SQLite database at',
      DB_PATH
    );

    // ============================
    // APPLY DATABASE SCHEMA
    // ============================
    const schemaPath = path.resolve(
      __dirname,
      '../../../database/schema.sql'
    );

    if (fs.existsSync(schemaPath)) {
      const schema = fs.readFileSync(schemaPath, 'utf8');

      db.run(schema);

      console.log('[DB] Schema applied.');
    }

    // ============================
    // APPLY SEED DATA
    // ============================
    const seedPath = path.resolve(
      __dirname,
      '../../../database/seed.sql'
    );

    if (fs.existsSync(seedPath)) {
      const hash = bcrypt.hashSync(
        'BloodConnect@123',
        10
      );

      const rawSeed = fs.readFileSync(
        seedPath,
        'utf8'
      );

      const seedSql = rawSeed.replace(
        /'\$2a\$10\$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyQSz7LH5'/g,
        `'${hash}'`
      );

      db.run(seedSql);

      console.log(
        '[DB] Seed data applied.'
      );
    }
  }

  // ==========================================
  // ALWAYS ENSURE .COM DEMO ACCOUNTS
  // ==========================================
  ensureDemoAccounts();

  // Persist in-memory SQLite database every 30 seconds
  const persistInterval = setInterval(
    persistDb,
    30000
  );

  if (persistInterval.unref) {
    persistInterval.unref();
  }

  return getDbWrapper();
}

/** Wrap sql.js API */
function getDbWrapper() {
  return {
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
        console.error(
          '[DB] Query error:',
          err.message,
          '\nSQL:',
          sql
        );

        throw err;
      }
    },

    run(sql, params = []) {
      try {
        db.run(sql, params);

        const changes = db.getRowsModified();

        let lastInsertRowid = 0;

        try {
          const res = db.exec(
            'SELECT last_insert_rowid() as id'
          );

          if (
            res.length > 0 &&
            res[0].values.length > 0
          ) {
            lastInsertRowid =
              res[0].values[0][0];
          }
        } catch (e) {}

        persistDb();

        return {
          changes,
          lastInsertRowid
        };
      } catch (err) {
        console.error(
          '[DB] Run error:',
          err.message,
          '\nSQL:',
          sql
        );

        throw err;
      }
    },

    exec(sql) {
      try {
        db.exec(sql);


        persistDb();
      } catch (err) {
        console.error(
          '[DB] Exec error:',
          err.message
        );

        throw err;
      }
    }
  };
}

module.exports = {
  initDb,
  getDbWrapper
};