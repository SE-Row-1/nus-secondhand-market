-- Insert initial departments
INSERT INTO department (acronym, name) VALUES
('ISS', 'Institute of System Science'),
('SoC', 'School of Computing'),
('DBS', 'Department of Business'),
('ECE', 'Electrical and Computer Engineering');

-- Insert initial accounts
INSERT INTO account (email, password_hash, password_salt, nickname, avatar_url, department_id, phone, preferred_currency)
VALUES
('user1@u.nus.edu', 'hashed_password1', 'salt1', 'User One', 'https://example.com/avatar1.png', 1, '12345678', 'SGD'),
('user2@u.nus.edu', 'hashed_password2', 'salt2', 'User Two', 'https://example.com/avatar2.png', 2, '23456789', 'CHN'),
('user3@u.nus.edu', 'hashed_password3', 'salt3', 'User Three', 'https://example.com/avatar3.png', 3, '34567890', 'KOR');

-- Insert initial items
INSERT INTO item (account_id, name, description, price, photo_urls, is_packed, status)
VALUES
(1, 'Laptop', 'A high-performance laptop for sale.', 1500.00, '{"https://example.com/photo1.png"}', false, 'for sale'),
(1, 'Headphones', 'Noise-canceling headphones.', 200.00, '{"https://example.com/photo2.png"}', false, 'for sale'),
(2, 'Smartphone', 'Latest model smartphone.', 800.00, '{"https://example.com/photo3.png"}', false, 'for sale'),
(3, 'Book', 'A popular programming book.', 30.00, '{"https://example.com/photo4.png"}', false, 'for sale');

-- Insert initial item packs
INSERT INTO item_pack (account_id, name, discount, item_summaries)
VALUES
(1, 'Laptop Bundle', 0.10, '[{"item_id": 1, "quantity": 1}, {"item_id": 2, "quantity": 1}]'),
(2, 'Smartphone Accessories', 0.05, '[{"item_id": 3, "quantity": 1}]'),
(3, 'Programming Books Collection', 0.20, '[{"item_id": 4, "quantity": 3}]');

-- Insert initial wishlist entries
INSERT INTO wishlist (account_id, item_id, created_at)
VALUES
(1, 3, now()),
(2, 1, now()),
(2, 4, now()),
(3, 2, now());
