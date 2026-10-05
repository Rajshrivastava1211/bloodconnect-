# BloodConnect – Blood Donation Camp Management and Donor Registration Portal

BloodConnect is a web-based portal designed to streamline blood donation campaigns and volunteer donor registrations. It features online pre-screening questionnaires to evaluate donor eligibility, manages camps, logs outcomes, and issues verifiable certificates.

This project is built for the **TYIT Semester 5 BSc IT (2026–27) College CEP (College Evaluation Project)**.

### Group Members:
*   **Shrivastava Raj Santosh** (Roll No. 61)
*   **Zanke Om Suresh** (Roll No. 122)

---

## 🛠️ Technology Stack

*   **Frontend**: React (v19), React Router (v7), Chart.js, React Icons, Tailwind CSS (v4), Axios
*   **Backend**: Node.js, Express.js
*   **Database**: SQLite3 (Self-initializing, zero-config file database)
*   **APIs**: RESTful architecture with JWT authentication guards

---

## 📁 Project Directory Structure

```text
bloodconnect-v2/
├── client/                     # React Frontend
│   ├── src/
│   │   ├── components/         # Protected routes, Navbar, Footer, Sidebar, Cards
│   │   ├── context/            # AuthContext (state, JWT cookies)
│   │   ├── pages/              # Public, Donor, Organizer, Admin views
│   │   └── services/           # API Axios helper
│   ├── package.json
│   └── vite.config.js
├── server/                     # Express Backend
│   ├── src/
│   │   ├── config/             # DB setup (SQLite)
│   │   ├── controllers/        # Auth, Camps, Eligibility, Stats controllers
│   │   ├── middleware/         # Auth, Role-based route guards
│   │   ├── routes/             # Express Route declarations
│   │   └── server.js           # Server initialization
│   ├── blood_connect.db        # Auto-created SQLite Database
│   └── package.json
├── start-dev.js                # Root script to run both servers concurrently
└── README.md                   # Setup and execution guide
```

---

## 🗄️ Database Schema Details

The portal automatically builds a SQLite relational schema upon server startup.

### 1. `users` Table
Stores authentication and profile details for all users (donors, organizers, admins).
*   `id` (INTEGER, Primary Key, Auto-Increment)
*   `name` (TEXT, Not Null)
*   `email` (TEXT, Unique, Not Null)
*   `password` (TEXT, Not Null)
*   `role` (TEXT, 'donor', 'organizer', 'admin')
*   `phone` (TEXT, Not Null)
*   `blood_group` (TEXT, Nullable)
*   `dob` (TEXT, Nullable)
*   `gender` (TEXT, Nullable)
*   `city` (TEXT, Nullable)
*   `address` (TEXT, Nullable)
*   `organization_name` (TEXT, Nullable - for organizers)
*   `is_active` (INTEGER, Default 1 - account activation toggle)
*   `created_at` (TIMESTAMP)

### 2. `donation_camps` Table
Maintains scheduled blood donation drives.
*   `id` (INTEGER, Primary Key)
*   `organizer_id` (INTEGER, Foreign Key &rarr; `users`)
*   `name` (TEXT, Not Null)
*   `description` (TEXT)
*   `date` (TEXT, Not Null)
*   `start_time` (TEXT)
*   `end_time` (TEXT)
*   `venue` (TEXT, Not Null)
*   `address` (TEXT)
*   `city` (TEXT, Not Null)
*   `capacity` (INTEGER, Not Null)
*   `status` (TEXT, 'draft', 'upcoming', 'open', 'full', 'completed', 'cancelled')
*   `created_at` (TIMESTAMP)

### 3. `camp_registrations` Table
Maps donors registering for camps.
*   `id` (INTEGER, Primary Key)
*   `camp_id` (INTEGER, Foreign Key &rarr; `donation_camps`)
*   `donor_id` (INTEGER, Foreign Key &rarr; `users`)
*   `registration_code` (TEXT, Unique, Not Null - e.g. REG-A1B2)
*   `screening_outcome` (TEXT, Nullable: 'preliminary_passed', 'medical_review_required')
*   `attendance` (INTEGER, Default 0)
*   `donation_status` (TEXT, Nullable: 'donated', 'did_not_donate', 'deferred')
*   `units_donated` (REAL, Default 0.0)
*   `certificate_code` (TEXT, Unique, Nullable)
*   `notes` (TEXT)
*   `status` (TEXT, 'registered', 'attended', 'cancelled')
*   `created_at` (TIMESTAMP)

### 4. `eligibility_responses` Table
Saves questionnaire JSON files.
*   `id` (INTEGER, Primary Key)
*   `registration_id` (INTEGER, Foreign Key &rarr; `camp_registrations`)
*   `answers_json` (TEXT - Raw JSON format)
*   `flags_json` (TEXT - Flagged conditions list)
*   `outcome` (TEXT)
*   `created_at` (TIMESTAMP)

### 5. `blood_banks` Table
Local blood bank directory listing.
*   `id` (INTEGER, Primary Key)
*   `name` (TEXT, Not Null)
*   `city` (TEXT, Not Null)
*   `area` (TEXT)
*   `contact` (TEXT)
*   `email` (TEXT)
*   `address` (TEXT)
*   `services` (TEXT)
*   `created_at` (TIMESTAMP)

### 6. `faqs` Table
List of FAQs shown on the dashboard.
*   `id` (INTEGER, Primary Key)
*   `question` (TEXT, Not Null)
*   `answer` (TEXT, Not Null)
*   `category` (TEXT)
*   `display_order` (INTEGER)

### 7. `feedback` Table
Evaluates camp experience.
*   `id` (INTEGER, Primary Key)
*   `camp_registration_id` (INTEGER)
*   `rating` (INTEGER)
*   `comments` (TEXT)

---

## 🚀 Installation & Running Guide

### Step 1: Install Dependencies
Open your command terminal at the project root folder and run:
```bash
# Install root script dependencies
npm install

# Install client packages
cd client
npm install

# Install server packages
cd ../server
npm install
```

### Step 2: Configure Environment Variables
Inside `server/.env`, verify the secret keys:
```env
PORT=5001
JWT_SECRET=super_secret_bloodconnect_token_key_12345
```

### Step 3: Run the Application Concurrently
Start the unified script from the root folder:
```bash
cd ..
node start-dev.js
```
*   **React Frontend** starts on `http://localhost:5173`
*   **Express Backend** starts on `http://localhost:5001`

---

## 🔑 Seeder & Demo Credentials

The backend automatically creates the following mock credentials for testing and evaluation during vivas (the Login page also includes **one-click autofill buttons** for all three):

*   **Password for all demo accounts**: `BloodConnect@123`

### 1. Administrator Account
*   **Email**: `admin@bloodconnect.org`
*   **Password**: `BloodConnect@123`
*   **Role**: `admin`
*   **Capabilities**: Global metrics & analytics (4 Chart.js visualizations), user account activation/deactivation, manage camps, blood bank directory CRUD, FAQ management, and CSV export.

### 2. Organizer Account
*   **Email**: `organizer1@bloodconnect.org`
*   **Password**: `BloodConnect@123`
*   **Role**: `organizer`
*   **Capabilities**: Schedule and manage donation camps, review donor pre-screening answers, mark donor attendance, log blood units collected, and trigger certificates.

### 3. Donor Account
*   **Email**: `donor1@bloodconnect.org`
*   **Password**: `BloodConnect@123`
*   **Role**: `donor`
*   **Capabilities**: Browse camps, register with unique registration codes, complete 6-step eligibility wizard, view certificates, track donation history, and submit ratings.

---

## 📡 API Endpoints Index

### 🔓 Public & Authentication APIs
*   `POST /api/auth/register` - Create volunteer donor accounts
*   `POST /api/auth/login` - Authenticate users (returns token & role)
*   `GET /api/auth/me` - Verifies current user profile JWT

### 🏥 Donation Camps APIs
*   `GET /api/camps` - Query scheduled camps
*   `POST /api/camps` - Schedule a new drive (Organizer only)
*   `PUT /api/camps/:id` - Edit camp configuration (Organizer only)
*   `DELETE /api/camps/:id` - Soft cancel camp (Organizer only)

### ✍️ Registrations & Attendance APIs
*   `POST /api/registrations` - Register donor for camp slot
*   `GET /api/registrations/my` - Fetch logged-in donor's registrations
*   `DELETE /api/registrations/:id` - Cancel camp registration
*   `PATCH /api/registrations/:id/attendance` - Log donor attendance status (Organizer only)

### 🩺 Eligibility Pre-Screening APIs
*   `POST /api/eligibility` - Submit the 6-step pre-screening questionnaire
*   `GET /api/certificates/:code` - Verify and print donor certificate

### 📊 Management APIs (Admin Only)
*   `GET /api/admin/statistics` - Portal dashboard metric aggregations
*   `GET /api/admin/users` - Fetch all user accounts
*   `PATCH /api/admin/users/:id/status` - Toggle account status (`is_active` state)
*   `GET /api/admin/feedback` - Audit donor feedback surveys
*   `GET /api/admin/reports` - Export overall camp outcomes spreadsheet

---
*Developed as part of Sem-5 BSc IT CEP curriculum.*
