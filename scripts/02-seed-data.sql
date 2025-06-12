-- Insert sample data

-- Insert business details
INSERT OR REPLACE INTO business_details (id, name, description, address, phone, email) 
VALUES (
    1, 
    'Wellness Center Pro', 
    'Professional wellness and consultation services for your health and wellbeing.',
    '123 Wellness Street, Health City, HC 12345',
    '+1 (555) 123-4567',
    'info@wellnesscenter.com'
);

-- Insert sample services
INSERT OR IGNORE INTO services (name, description, price, duration) VALUES
('Individual Consultation', 'One-on-one consultation session tailored to your needs', 120.00, 60),
('Group Session', 'Group consultation session for multiple participants', 80.00, 90),
('Extended Consultation', 'Extended consultation for complex cases', 200.00, 120),
('Follow-up Session', 'Follow-up session for existing clients', 90.00, 45);

-- Insert admin user (username: admin, password: admin123)
INSERT OR IGNORE INTO admin_users (username, password) VALUES ('admin', 'admin123');

-- Insert sample customers
INSERT OR IGNORE INTO customers (name, phone, email) VALUES
('John Smith', '+1-555-0101', 'john.smith@email.com'),
('Sarah Johnson', '+1-555-0102', 'sarah.j@email.com'),
('Mike Davis', '+1-555-0103', 'mike.davis@email.com');
