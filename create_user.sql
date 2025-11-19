-- Create default doctor user
-- Username: doctor
-- Password: doctor123
-- The password is BCrypt encoded

INSERT INTO users (username, password, role, created_at, updated_at) 
VALUES ('doctor', '$2a$10$xQjKZjKZjKZjKZjKZjKZjOe7Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8', 'DOCTOR', NOW(), NOW());
