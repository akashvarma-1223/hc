create database manhaasapp;
use manhaasapp;

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    name VARCHAR(255),
    rollnumber VARCHAR(50),
    roomNo VARCHAR(50),
    hostelblock VARCHAR(100),
    CHECK (role = 'admin' OR (name IS NOT NULL AND rollnumber IS NOT NULL AND hostelblock IS NOT NULL))
);

CREATE TABLE lost_found_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    status ENUM('lost', 'found', 'claimed','With Caretaker') NOT NULL,
    reported_by VARCHAR(255) NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    additional_details TEXT,
    image_url VARCHAR(255),
    user_id INT,
    image longblob,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE TABLE announcements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    typec VARCHAR(100) NOT NULL,
    block VARCHAR(100), -- Only required if typec = 'Block Specific'
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    admin_id INT NOT NULL,
    FOREIGN KEY (admin_id) REFERENCES users(id)
);

CREATE TABLE complaints (
    id INT PRIMARY KEY AUTO_INCREMENT,
    room VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,           -- Added Title
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,        -- Added Category
    date DATE NOT NULL,                    -- Added Date
    status ENUM('pending', 'inProgress', 'resolved') NOT NULL DEFAULT 'pending',
    submitted TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    hblock VARCHAR(20),
    is_anonymous BOOLEAN DEFAULT FALSE,
    user_id INT,
    typec VARCHAR(20),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
-- drop table complaints;

CREATE TABLE late_entry_requests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id VARCHAR(50) NOT NULL,
    reason TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'approved', 'declined') NOT NULL DEFAULT 'pending',
    attachment_name VARCHAR(255),
    attachment_url VARCHAR(255),
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
-- ALTER TABLE late_entry_requests
-- ADD COLUMN attachment LONGBLOB;

-- ALTER TABLE late_entry_requests
-- ADD COLUMN date timestamp;
-- -- drop table late_entry_requests;

-- select * from users;

CREATE TABLE skillpost (
    id INT AUTO_INCREMENT PRIMARY KEY,
    postType CHAR(20) NOT NULL,
    category CHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    venue VARCHAR(255) NOT NULL,
    timings VARCHAR(100) NOT NULL,
    maxPeople INT NOT NULL DEFAULT 1, 
    currentParticipants INT NOT NULL DEFAULT 0,  -- Keeps track of how many people joined
    userId INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE skillpost_interests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    skillpost_id INT NOT NULL,
    user_id INT NOT NULL,
    interested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (skillpost_id) REFERENCES skillpost(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (skillpost_id, user_id) -- Prevents duplicate interests from the same user
);
-- drop table complaints;
-- ALTER TABLE lost_found_items ADD COLUMN image LONGBLOB;
-- SELECT * FROM skillpost WHERE userId = 1;
-- select * from skillpost;
-- select * from skillpost_interests;
-- select * from users;
-- INSERT INTO users (username, email, password, role, name, rollnumber, hostelblock) 
-- VALUES 
-- INSERT INTO users (username, email, password, role, name, rollnumber, hostelblock) 
-- VALUES ('m','manhaas1820@gmail.com', '$2a$10$Y7SD01/NMN6vAhCfJUobSO2vvxdzDZGvW/CBavH4cRa0j31wJH9Re', 'user','Yaswanth','b220508cs','D');
-- drop table skillpost;
-- drop table skillpost_interests;
-- select * from late_entry_requests;
-- INSERT INTO users (username, email, password, role,hostelblock) 
-- VALUES ('caretakerA', 'manhaas1820@gmail.com', '$2a$10$Y7SD01/NMN6vAhCfJUobSO2vvxdzDZGvW/CBavH4cRa0j31wJH9Re', 'admin', 'A'),
--  ('CaretakerB', 'manhaas11820@gmail.com', '$2a$10$Y7SD01/NMN6vAhCfJUobSO2vvxdzDZGvW/CBavH4cRa0j31wJH9Re', 'admin', 'B'),
--   ('CaretakerC', 'manhaas18120@gmail.com', '$2a$10$Y7SD01/NMN6vAhCfJUobSO2vvxdzDZGvW/CBavH4cRa0j31wJH9Re', 'admin', 'C'),
--    ('CaretakerD', 'manhaas111820@gmail.com', '$2a$10$Y7SD01/NMN6vAhCfJUobSO2vvxdzDZGvW/CBavH4cRa0j31wJH9Re', 'admin', 'D')
--  ; password=1234 u can use it 
-- select * from late_entry_requests;
-- select * from complaints;
-- select * from lost_found_items;
ALTER TABLE late_entry_requests
ADD COLUMN attachment LONGBLOB;

ALTER TABLE late_entry_requests
ADD COLUMN date timestamp;
-- UPDATE users SET roomNo = '8A09' WHERE id = 5;
-- UPDATE users SET roomNo = '7A09' WHERE id = 6;
-- UPDATE users SET roomNo = '1C10' WHERE id = 7;
-- UPDATE users SET roomNo = '4B10' WHERE id = 8;
-- UPDATE users SET roomNo = '8D10' WHERE id = 13;
-- select * from late_entry_requests;

-- select * from complaints;
-- select * from announcements;
-- drop table announcements;
-- select * from users where email='manhaas1820@gmail.com';
-- DELETE FROM users WHERE id = 5;

-- select * from users;
-- select * from food_sharing_posts;
-- INSERT INTO food_sharing_posts (user_id, location, post_type, title, description, price) 
-- VALUES 
-- (1, 'Room A-101', 'Offering Food', 'Snacks', 'Oreo biscuits, Lays packets, chocolates', 'Free');


-- UPDATE users SET roomNo = '4G59' WHERE id = 8;
-- UPDATE users SET roomNo = '310' WHERE id = 10;
-- UPDATE announcements
-- SET category = 'Electrical'
-- WHERE id = 3;
select * from users;
select * from  skillpost;

-- drop table lost_found_items;
-- select * from food_sharing_posts;
-- DELETE from food_sharing_posts WHERE id = 3;


