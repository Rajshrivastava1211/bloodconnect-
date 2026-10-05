-- BloodConnect Blood Donation Camp Portal
-- SQLite Database Schema
-- Enable foreign keys
PRAGMA foreign_keys = ON;

-- ============================================================
-- 1. USERS — Authentication & base profile for all roles
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT    NOT NULL,
  email         TEXT    NOT NULL UNIQUE,
  password_hash TEXT    NOT NULL,
  role          TEXT    NOT NULL CHECK(role IN ('donor','organizer','admin')) DEFAULT 'donor',
  is_active     INTEGER NOT NULL DEFAULT 1,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 2. DONORS — Extended profile for donor users
-- ============================================================
CREATE TABLE IF NOT EXISTS donors (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id     INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  phone       TEXT,
  blood_group TEXT,
  dob         TEXT,
  gender      TEXT,
  city        TEXT,
  address     TEXT,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 3. ORGANIZERS — Extended profile for organizer users
-- ============================================================
CREATE TABLE IF NOT EXISTS organizers (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id           INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  organization_name TEXT,
  phone             TEXT,
  city              TEXT,
  address           TEXT,
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 4. CAMPS — Donation drive scheduling
-- ============================================================
CREATE TABLE IF NOT EXISTS camps (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  organizer_id INTEGER NOT NULL REFERENCES users(id),
  name         TEXT    NOT NULL,
  description  TEXT,
  date         TEXT    NOT NULL,
  start_time   TEXT    DEFAULT '09:00',
  end_time     TEXT    DEFAULT '17:00',
  venue        TEXT    NOT NULL,
  address      TEXT,
  city         TEXT    NOT NULL,
  capacity     INTEGER NOT NULL DEFAULT 50,
  status       TEXT    NOT NULL DEFAULT 'upcoming'
                CHECK(status IN ('draft','upcoming','open','full','ongoing','completed','cancelled')),
  image_url    TEXT,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 5. CAMP REGISTRATIONS — Donors registering for camps
-- ============================================================
CREATE TABLE IF NOT EXISTS camp_registrations (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  donor_id          INTEGER NOT NULL REFERENCES users(id),
  camp_id           INTEGER NOT NULL REFERENCES camps(id),
  registration_code TEXT    NOT NULL UNIQUE,
  status            TEXT    NOT NULL DEFAULT 'registered'
                     CHECK(status IN ('registered','attended','cancelled')),
  attendance        INTEGER NOT NULL DEFAULT 0,
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(donor_id, camp_id)
);

-- ============================================================
-- 6. ELIGIBILITY SCREENINGS — Pre-screening questionnaire results
-- ============================================================
CREATE TABLE IF NOT EXISTS eligibility_screenings (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  registration_id INTEGER NOT NULL UNIQUE REFERENCES camp_registrations(id) ON DELETE CASCADE,
  answers_json    TEXT    NOT NULL,
  outcome         TEXT    NOT NULL CHECK(outcome IN ('preliminary_passed','medical_review_required')),
  flags_json      TEXT    DEFAULT '[]',
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 7. DONATION RECORDS — Blood donation outcomes logged by organizers
-- ============================================================
CREATE TABLE IF NOT EXISTS donation_records (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  registration_id INTEGER NOT NULL UNIQUE REFERENCES camp_registrations(id),
  status          TEXT    NOT NULL DEFAULT 'donated'
                   CHECK(status IN ('donated','did_not_donate','deferred')),
  units_donated   REAL    NOT NULL DEFAULT 1.0,
  notes           TEXT,
  recorded_by     INTEGER REFERENCES users(id),
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 8. CERTIFICATES — Appreciation certificates issued to donors
-- ============================================================
CREATE TABLE IF NOT EXISTS certificates (
  id                 INTEGER PRIMARY KEY AUTOINCREMENT,
  donation_record_id INTEGER NOT NULL UNIQUE REFERENCES donation_records(id),
  certificate_code   TEXT    NOT NULL UNIQUE,
  issued_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 9. BLOOD BANKS — Directory of hospital blood banks
-- ============================================================
CREATE TABLE IF NOT EXISTS blood_banks (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  name         TEXT    NOT NULL,
  city         TEXT    NOT NULL,
  area         TEXT,
  contact      TEXT,
  email        TEXT,
  address      TEXT,
  services     TEXT,
  is_demo_data INTEGER DEFAULT 1,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 10. FAQS — Public FAQ articles
-- ============================================================
CREATE TABLE IF NOT EXISTS faqs (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  question      TEXT    NOT NULL,
  answer        TEXT    NOT NULL,
  category      TEXT    DEFAULT 'General',
  display_order INTEGER DEFAULT 0,
  is_active     INTEGER NOT NULL DEFAULT 1,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 11. FEEDBACK — Post-camp donor feedback
-- ============================================================
CREATE TABLE IF NOT EXISTS feedback (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  donor_id  INTEGER NOT NULL REFERENCES users(id),
  camp_id   INTEGER NOT NULL REFERENCES camps(id),
  rating    INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
  comments  TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(donor_id, camp_id)
);

-- ============================================================
-- 12. NOTIFICATIONS — In-app alert messages for users
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message    TEXT    NOT NULL,
  type       TEXT    DEFAULT 'general',
  is_read    INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
