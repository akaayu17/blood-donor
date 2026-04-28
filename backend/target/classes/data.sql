-- Blood Banks
INSERT IGNORE INTO blood_bank (bank_id, bank_name, location, license_number) VALUES
(1, 'City Central Blood Bank', '123 Main Street, Downtown, New York, NY 10001', 'LIC-NYC-001'),
(2, 'Metro Life Blood Center', '456 Park Avenue, Midtown, New York, NY 10022', 'LIC-NYC-002'),
(3, 'Sunrise Medical Blood Bank', '789 Broadway, Upper West Side, New York, NY 10025', 'LIC-NYC-003'),
(4, 'Harbor Health Blood Services', '321 Harbor Blvd, Brooklyn, NY 11201', 'LIC-NYB-004');

-- Blood Bank Phones
INSERT IGNORE INTO blood_bank_phone (bank_id, phone_number) VALUES
(1, '+1-212-555-0101'), (1, '+1-212-555-0102'),
(2, '+1-212-555-0201'), (2, '+1-212-555-0202'),
(3, '+1-212-555-0301'),
(4, '+1-718-555-0401'), (4, '+1-718-555-0402');

-- Users (passwords are BCrypt of "password123")
INSERT IGNORE INTO user (user_id, full_name, email, password_hash, date_of_birth, gender, role, address) VALUES
(1,  'Admin User',       'admin@blooddonor.com',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh/K', '1985-01-15', 'Male',   'Admin',  '1 Admin Plaza, New York, NY'),
(2,  'Alice Johnson',    'alice@example.com',      '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh/K', '1990-05-20', 'Female', 'Donor',  '22 Rose Lane, Brooklyn, NY'),
(3,  'Bob Smith',        'bob@example.com',        '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh/K', '1988-09-10', 'Male',   'Donor',  '45 Oak Street, Queens, NY'),
(4,  'Carol White',      'carol@example.com',      '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh/K', '1995-03-22', 'Female', 'Donor',  '88 Maple Ave, Manhattan, NY'),
(5,  'David Brown',      'david@example.com',      '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh/K', '1992-07-14', 'Male',   'Donor',  '15 Pine Rd, Bronx, NY'),
(6,  'Emma Davis',       'emma@example.com',       '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh/K', '1998-11-30', 'Female', 'Donor',  '67 Birch Blvd, Staten Island, NY'),
(7,  'Frank Wilson',     'frank@example.com',      '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh/K', '1983-04-05', 'Male',   'Donor',  '9 Cedar Court, Manhattan, NY'),
(8,  'Grace Lee',        'grace@example.com',      '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh/K', '1997-08-18', 'Female', 'User',   '34 Elm Street, Brooklyn, NY'),
(9,  'Henry Martinez',   'henry@example.com',      '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh/K', '1991-12-25', 'Male',   'User',   '56 Ash Ave, Queens, NY'),
(10, 'Isabelle Taylor',  'isabelle@example.com',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh/K', '1993-02-14', 'Female', 'User',   '78 Walnut Dr, Manhattan, NY');

-- User Phones
INSERT IGNORE INTO user_phone (user_id, phone_number) VALUES
(1, '+1-212-100-0001'), (2, '+1-718-100-0002'), (3, '+1-646-100-0003'),
(4, '+1-917-100-0004'), (5, '+1-212-100-0005'), (6, '+1-718-100-0006'),
(7, '+1-646-100-0007'), (8, '+1-917-100-0008'), (9, '+1-212-100-0009'), (10, '+1-718-100-0010');

-- Donors
INSERT IGNORE INTO donor (donor_id, user_id, blood_group, last_donation_date, eligibility_status) VALUES
(1, 2, 'A+',  '2024-01-15', 'Eligible'),
(2, 3, 'B+',  '2024-02-20', 'Eligible'),
(3, 4, 'O-',  '2023-12-05', 'Eligible'),
(4, 5, 'AB+', '2024-03-10', 'Eligible'),
(5, 6, 'A-',  '2024-01-28', 'Ineligible'),
(6, 7, 'O+',  NULL,         'Pending');

-- Blood Stock (16 records across 4 banks, all 8 blood groups split across banks)
INSERT IGNORE INTO blood_stock (bank_id, blood_group, quantity) VALUES
(1, 'A+',  450.00), (1, 'A-',  120.00), (1, 'B+',  380.00), (1, 'B-',  80.00),
(2, 'AB+', 210.00), (2, 'AB-', 60.00),  (2, 'O+',  520.00), (2, 'O-',  95.00),
(3, 'A+',  175.00), (3, 'B+',  290.00), (3, 'O+',  430.00), (3, 'AB+', 140.00),
(4, 'A-',  50.00),  (4, 'B-',  45.00),  (4, 'O-',  70.00),  (4, 'AB-', 30.00);

-- Donations (8 records)
INSERT IGNORE INTO donation (donor_id, bank_id, donation_date, quantity, screening_status) VALUES
(1, 1, '2024-01-15', 450.00, 'Passed'),
(2, 1, '2024-02-20', 450.00, 'Passed'),
(3, 2, '2023-12-05', 450.00, 'Passed'),
(4, 2, '2024-03-10', 450.00, 'Passed'),
(5, 3, '2024-01-28', 450.00, 'Failed'),
(6, 3, '2024-03-22', 450.00, 'Pending'),
(1, 4, '2024-04-05', 350.00, 'Passed'),
(2, 4, '2024-04-18', 350.00, 'Pending');

-- Blood Requests (8 records)
INSERT IGNORE INTO blood_request (user_id, bank_id, blood_group, quantity, urgency_level, request_date, status) VALUES
(8,  1, 'A+',  250.00, 'Critical', '2024-04-01', 'Fulfilled'),
(9,  2, 'O-',  150.00, 'High',     '2024-04-05', 'Pending'),
(10, 1, 'B+',  200.00, 'Medium',   '2024-04-08', 'Pending'),
(8,  3, 'AB+', 100.00, 'Low',      '2024-04-10', 'Cancelled'),
(9,  2, 'O+',  300.00, 'High',     '2024-04-12', 'Pending'),
(10, 4, 'A-',  150.00, 'Critical', '2024-04-15', 'Pending'),
(8,  1, 'B-',  50.00,  'Medium',   '2024-04-18', 'Fulfilled'),
(9,  3, 'AB-', 80.00,  'Low',      '2024-04-20', 'Pending');
