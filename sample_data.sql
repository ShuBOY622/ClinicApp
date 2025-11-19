-- Sample Patients
INSERT INTO patients (first_name, last_name, date_of_birth, gender, phone, email, address, blood_group, medical_history, created_at, updated_at, is_deleted) VALUES
('John', 'Doe', '1985-05-15', 'Male', '9876543210', 'john.doe@example.com', '123 Main St, City', 'O+', 'None', NOW(), NOW(), false),
('Jane', 'Smith', '1990-08-20', 'Female', '9876543211', 'jane.smith@example.com', '456 Oak Ave, Town', 'A-', 'Asthma', NOW(), NOW(), false),
('Robert', 'Johnson', '1978-12-10', 'Male', '9876543212', 'robert.j@example.com', '789 Pine Ln, Village', 'B+', 'Diabetes', NOW(), NOW(), false),
('Emily', 'Davis', '1995-03-25', 'Female', '9876543213', 'emily.d@example.com', '321 Elm St, City', 'AB+', 'None', NOW(), NOW(), false),
('Michael', 'Brown', '1982-07-05', 'Male', '9876543214', 'michael.b@example.com', '654 Maple Dr, Town', 'O-', 'Hypertension', NOW(), NOW(), false);

-- Sample Medicines
INSERT INTO medicines (name, generic_name, category, form_type, dosage, manufacturer, price, stock_quantity, expiry_date, created_at, updated_at, is_deleted) VALUES
('Paracetamol', 'Acetaminophen', 'Analgesic', 'Tablet', '500mg', 'PharmaCorp', 2.50, 1000, '2026-12-31', NOW(), NOW(), false),
('Amoxicillin', 'Amoxicillin', 'Antibiotic', 'Capsule', '500mg', 'MediLife', 5.00, 500, '2025-06-30', NOW(), NOW(), false),
('Ibuprofen', 'Ibuprofen', 'NSAID', 'Tablet', '400mg', 'HealthCare Inc', 3.00, 800, '2026-05-15', NOW(), NOW(), false),
('Cetirizine', 'Cetirizine', 'Antihistamine', 'Tablet', '10mg', 'AllergySol', 1.50, 600, '2025-11-30', NOW(), NOW(), false),
('Metformin', 'Metformin', 'Antidiabetic', 'Tablet', '500mg', 'DiabetCare', 4.00, 400, '2026-08-20', NOW(), NOW(), false),
('Omeprazole', 'Omeprazole', 'Proton Pump Inhibitor', 'Capsule', '20mg', 'GastroMed', 6.00, 300, '2025-09-10', NOW(), NOW(), false),
('Amlodipine', 'Amlodipine', 'Calcium Channel Blocker', 'Tablet', '5mg', 'HeartHealth', 3.50, 450, '2026-03-25', NOW(), NOW(), false),
('Azithromycin', 'Azithromycin', 'Antibiotic', 'Tablet', '500mg', 'BioPharma', 8.00, 200, '2025-12-15', NOW(), NOW(), false);

-- Sample Follow-ups (Some for today, some future, some pending)
INSERT INTO follow_ups (patient_id, follow_up_date, reason, status, reminder_sent, created_at, updated_at, is_deleted) VALUES
(1, NOW(), 'General Checkup', 'PENDING', false, NOW(), NOW(), false),
(2, DATE_ADD(NOW(), INTERVAL 2 DAY), 'Asthma Review', 'PENDING', false, NOW(), NOW(), false),
(3, DATE_ADD(NOW(), INTERVAL 7 DAY), 'Diabetes Monitoring', 'PENDING', false, NOW(), NOW(), false),
(1, DATE_SUB(NOW(), INTERVAL 10 DAY), 'Initial Consultation', 'COMPLETED', false, NOW(), NOW(), false),
(4, NOW(), 'Blood Test Results', 'PENDING', false, NOW(), NOW(), false);
