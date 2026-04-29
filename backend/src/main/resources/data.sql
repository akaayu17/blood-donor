-- 1. Insert Users
-- Enums (Gender, Role) must match exactly the String values in your Java code
INSERT INTO user (user_id, full_name, email, password_hash, date_of_birth, gender, role, address, created_at, updated_at)
VALUES
    (1, 'John Doe', 'johndoe@example.com', 'hashed_pwd_123', '1990-05-15', 'Male', 'Donor', '123 Main St, Springfield', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (2, 'Jane Smith', 'janesmith@example.com', 'hashed_pwd_456', '1985-08-22', 'Female', 'User', '456 Oak Ave, Shelbyville', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (3, 'Admin User', 'admin@bloodbank.com', 'hashed_pwd_789', '1980-01-01', 'Other', 'Admin', '789 Central Blvd, Capital City', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 2. Insert User Phones
INSERT INTO user_phone (phone_id, user_id, phone_number)
VALUES
    (1, 1, '+1-555-0100'),
    (2, 2, '+1-555-0200'),
    (3, 2, '+1-555-0201');

-- 3. Insert Donors (Requires user_id)
-- Enum (EligibilityStatus) matched as String
INSERT INTO donor (donor_id, user_id, blood_group, last_donation_date, eligibility_status)
VALUES
    (1, 1, 'O+', '2023-11-15', 'Eligible');

-- 4. Insert Blood Banks
INSERT INTO blood_bank (bank_id, bank_name, location, license_number)
VALUES
    (1, 'City Central Blood Bank', 'Downtown Medical District', 'LIC-10001'),
    (2, 'Red Cross Regional Center', 'Westside Health Park', 'LIC-20002');

-- 5. Insert Blood Bank Phones
INSERT INTO blood_bank_phone (phone_id, bank_id, phone_number)
VALUES
    (1, 1, '+1-800-555-1111'),
    (2, 2, '+1-800-555-2222');

-- 6. Insert Blood Stocks (Requires bank_id)
INSERT INTO blood_stock (stock_id, bank_id, blood_group, quantity)
VALUES
    (1, 1, 'O+', 10.50),
    (2, 1, 'A-', 5.00),
    (3, 1, 'AB+', 2.50),
    (4, 2, 'O-', 8.00),
    (5, 2, 'B+', 12.00);

-- 7. Insert Blood Requests (Requires user_id and bank_id)
-- Enums (UrgencyLevel, RequestStatus) matched as Strings
INSERT INTO blood_request (request_id, user_id, bank_id, blood_group, quantity, urgency_level, request_date, status)
VALUES
    (1, 2, 1, 'O+', 2.00, 'High', '2024-03-01', 'Fulfilled'),
    (2, 2, 2, 'O-', 1.50, 'Critical', '2024-03-10', 'Pending');

-- 8. Insert Donations (Requires donor_id and bank_id)
-- Enum (ScreeningStatus) matched as String
INSERT INTO donation (donation_id, donor_id, bank_id, donation_date, quantity, screening_status)
VALUES
    (1, 1, 1, '2023-11-15', 0.50, 'Passed');

-- 9. Insert Request Fulfillments (Requires request_id and stock_id)
INSERT INTO request_fulfillment (fulfillment_id, request_id, stock_id, quantity_provided, fulfillment_date)
VALUES
    (1, 1, 1, 2.00, '2024-03-02');