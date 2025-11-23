-- Update existing patient phone numbers to international format (India +91)
-- This is required for WhatsApp reminders to work

UPDATE patients 
SET phone = CONCAT('+91', phone)
WHERE phone NOT LIKE '+%' AND is_deleted = false;

-- Verify the update
SELECT id, first_name, last_name, phone 
FROM patients 
WHERE is_deleted = false;
