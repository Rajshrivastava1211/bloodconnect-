-- BloodConnect Base Seed Data
-- Preserves clean database baseline with primary role accounts, blood banks, and FAQs only.
-- All passwords use bcrypt hash placeholder replaced at runtime by server/src/config/db.js (Password: BloodConnect@123).

PRAGMA foreign_keys = ON;

-- ============================================================
-- USERS (Core accounts for testing & viva evaluation)
-- ============================================================
INSERT OR IGNORE INTO users (id, name, email, password_hash, role, is_active) VALUES
  (1, 'Admin BloodConnect',    'admin@bloodconnect.org font-bold',  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyQSz7LH5', 'admin',     1),
  (2, 'Red Cross Organizer',   'organizer1@bloodconnect.org',       '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyQSz7LH5', 'organizer', 1),
  (3, 'Raj Shrivastava',       'donor1@bloodconnect.org',           '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyQSz7LH5', 'donor',     1);

-- ============================================================
-- ORGANIZERS
-- ============================================================
INSERT OR IGNORE INTO organizers (user_id, organization_name, phone, city, address) VALUES
  (2, 'Indian Red Cross Society - Mumbai', '022-22621946', 'Mumbai', 'Red Cross House, 143, Marine Lines, Mumbai - 400020');

-- ============================================================
-- DONORS
-- ============================================================
INSERT OR IGNORE INTO donors (user_id, phone, blood_group, dob, gender, city, address) VALUES
  (3, '9876543210', 'O+', '2002-04-15', 'male', 'Mumbai', 'Flat 12, Shivam CHS, Andheri West, Mumbai 400053');

-- ============================================================
-- BLOOD BANKS (Directory data)
-- ============================================================
INSERT OR IGNORE INTO blood_banks (name, city, area, contact, email, address, services) VALUES
  ('King Edward Memorial (KEM) Hospital Blood Bank', 'Mumbai', 'Parel', '022-24107000', 'bloodbank@kemhospital.org', 'Acharya Donde Marg, Parel, Mumbai - 400012', 'Whole Blood, Components, Apheresis'),
  ('Nair Hospital Blood Bank', 'Mumbai', 'Mumbai Central', '022-23027500', 'nairbb@nmmc.gov.in', 'Dr. A.L. Nair Rd, Mumbai Central, Mumbai - 400008', 'Whole Blood, PRC, Platelets, FFP'),
  ('SION Hospital Blood Bank', 'Mumbai', 'Sion', '022-24076381', 'sionbb@bmc.gov.in', 'S.G. Barve Marg, Sion, Mumbai - 400022', 'Whole Blood, Components'),
  ('Wockhardt Hospital Blood Bank', 'Mumbai', 'South Mumbai', '022-61784444', 'bloodbank@wockhardt.com', 'Nathalal Parikh Marg, Cuffe Parade, Mumbai - 400005', 'All Components, Irradiated Products'),
  ('Ruby Hall Clinic Blood Bank', 'Pune', 'Pune', '020-66455100', 'bloodbank@rubyhall.com', '40, Sassoon Road, Pune - 411001', 'Whole Blood, Components, Platelets'),
  ('Jehangir Hospital Blood Bank', 'Pune', 'Pune', '020-66810000', 'bb@jehangir.co.in', '32, Sassoon Road, Pune - 411001', 'Whole Blood, All Components'),
  ('AIIMS Blood Bank', 'Delhi', 'Ansari Nagar', '011-26594500', 'bb@aiims.edu', 'Sri Aurobindo Marg, Ansari Nagar, New Delhi - 110029', 'All Blood Products'),
  ('Safdarjung Hospital Blood Bank', 'Delhi', 'New Delhi', '011-26730000', 'blood@safdarjung.in', 'Safdarjung Hospital Campus, New Delhi - 110029', 'Whole Blood, Components'),
  ('Apollo Hospital Blood Bank', 'Bangalore', 'Bannerghatta', '080-26304050', 'bloodbank@apollo.com', '154/11, Bannerghatta Road, Bangalore - 560076', 'All Blood Products, Autologous'),
  ('Manipal Hospital Blood Bank', 'Bangalore', 'HAL Airport Road', '080-25024444', 'bloodbank@manipal.com', '98, HAL Airport Road, Bangalore - 560017', 'Whole Blood, Components');

-- ============================================================
-- FAQS
-- ============================================================
INSERT OR IGNORE INTO faqs (question, answer, category, display_order) VALUES
  ('Who can donate blood?', 'Generally, any healthy person aged 18-65 who weighs at least 50 kg and feels well can donate blood. You must not have donated within the last 90 days (3 months).', 'Eligibility', 1),
  ('How often can I donate blood?', 'Whole blood can be donated once every 3 months (90 days). Platelet donation can be done more frequently, up to 24 times per year.', 'Eligibility', 2),
  ('Does blood donation hurt?', 'The needle prick causes brief discomfort but the donation itself is painless. Most donors feel no pain during the process.', 'Process', 3),
  ('How long does the process take?', 'The entire process takes about 45-60 minutes, including registration, pre-screening, actual donation (10-15 minutes), and rest period.', 'Process', 4),
  ('What should I eat before donating?', 'Eat a nutritious meal 2-3 hours before donation. Avoid fatty foods. Stay well-hydrated by drinking plenty of water.', 'Preparation', 5),
  ('Can I donate if I have diabetes?', 'Controlled diabetes (diet-controlled or on oral medication) may be acceptable. Insulin-dependent diabetes is generally a temporary deferral. Medical staff will make the final decision.', 'Eligibility', 6),
  ('What happens after I donate?', 'You will rest for 10-15 minutes, receive refreshments, and should avoid strenuous activity for the rest of the day. Drink extra fluids for the next 24 hours.', 'Process', 7),
  ('Is blood donation safe?', 'Yes, blood donation is completely safe. Sterile, single-use equipment is used for each donor, so there is no risk of infection.', 'Safety', 8),
  ('Can I donate if I have a tattoo or piercing?', 'If the tattoo or piercing was done within the last 6 months, you are typically deferred. After 6 months with a clean bill of health, you may be eligible.', 'Eligibility', 9),
  ('How is my blood used?', 'Donated blood is tested, processed into components (red cells, platelets, plasma), and distributed to hospitals for patients needing transfusions due to surgery, trauma, or medical conditions.', 'General', 10);
