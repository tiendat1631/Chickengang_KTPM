-- Seed initial data for development (idempotent by clearing tables first)
-- Note: Hibernate creates/updates schema (ddl-auto=update). This runs after that.

-- Clear existing data (development only)
SET FOREIGN_KEY_CHECKS=0;
DELETE FROM movie;
DELETE FROM `user`;
SET FOREIGN_KEY_CHECKS=1;

-- Reset AUTO_INCREMENT counters
ALTER TABLE movie AUTO_INCREMENT = 1;
ALTER TABLE `user` AUTO_INCREMENT = 1;

INSERT INTO movie (title, director, actors, genres, release_date, duration, language, rated, description) VALUES
('The Shawshank Redemption', 'Frank Darabont', 'Tim Robbins, Morgan Freeman', 'Drama', '1994-09-23', '142 min', 'English', 'R', 'Two imprisoned men bond over a number of years, finding solace and eventual redemption.'),
('The Godfather', 'Francis Ford Coppola', 'Marlon Brando, Al Pacino', 'Crime, Drama', '1972-03-24', '175 min', 'English', 'R', 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.'),
('The Dark Knight', 'Christopher Nolan', 'Christian Bale, Heath Ledger', 'Action, Crime, Drama', '2008-07-18', '152 min', 'English', 'PG-13', 'Batman faces the Joker, a criminal mastermind who plunges Gotham into anarchy.'),
('Inception', 'Christopher Nolan', 'Leonardo DiCaprio, Joseph Gordon-Levitt', 'Action, Sci-Fi, Thriller', '2010-07-16', '148 min', 'English', 'PG-13', 'A thief who steals corporate secrets through dream-sharing technology is given an inverse task of planting an idea.'),
('Interstellar', 'Christopher Nolan', 'Matthew McConaughey, Anne Hathaway', 'Adventure, Drama, Sci-Fi', '2014-11-07', '169 min', 'English', 'PG-13', 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity''s survival.'),
('Parasite', 'Bong Joon-ho', 'Song Kang-ho, Lee Sun-kyun', 'Comedy, Drama, Thriller', '2019-05-30', '132 min', 'Korean', 'R', 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.'),
('Spirited Away', 'Hayao Miyazaki', 'Rumi Hiiragi, Miyu Irino', 'Animation, Adventure, Family', '2001-07-20', '125 min', 'Japanese', 'PG', 'During her family''s move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits.'),
('Avengers: Endgame', 'Anthony Russo, Joe Russo', 'Robert Downey Jr., Chris Evans', 'Action, Adventure, Sci-Fi', '2019-04-26', '181 min', 'English', 'PG-13', 'The Avengers assemble once more in order to undo Thanos'' actions and restore order to the universe.');

-- Users: store BCrypt-hashed passwords to align with PasswordEncoder
-- Password for both users = "123456" (BCrypt pre-hashed)
-- Hash generated with BCrypt (10 rounds). Update if encoder strength changes.
SET @pwd := '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';

INSERT INTO `user` (email, password, phone_number, role, is_active, address, created_at, updated_at, username, date_of_birth) VALUES
('admin@example.com', @pwd, '0900000000', 'ADMIN', true, 'Admin HQ', NOW(), NOW(), 'admin', '1990-01-01'),
('johndoe@example.com', @pwd, '0911111111', 'CUSTOMER', true, '123 Main St', NOW(), NOW(), 'johndoe', '1995-05-10');

-- Clear existing auditorium and related data
-- Note: Delete in reverse dependency order to avoid foreign key constraint violations
SET FOREIGN_KEY_CHECKS=0;
DELETE FROM payment;    -- Depends on booking
DELETE FROM ticket;     -- Depends on seat, screening, booking
DELETE FROM booking;    -- Depends on user, screening
DELETE FROM seat;       -- Depends on auditorium
DELETE FROM screening;  -- Depends on movie, auditorium
DELETE FROM auditorium; -- Independent table
SET FOREIGN_KEY_CHECKS=1;

-- Reset AUTO_INCREMENT counters for all tables
ALTER TABLE auditorium AUTO_INCREMENT = 1;
ALTER TABLE seat AUTO_INCREMENT = 1;
ALTER TABLE screening AUTO_INCREMENT = 1;
ALTER TABLE ticket AUTO_INCREMENT = 1;
ALTER TABLE booking AUTO_INCREMENT = 1;
ALTER TABLE payment AUTO_INCREMENT = 1;

-- Insert auditoriums
INSERT INTO auditorium (name) VALUES
('Phòng 1'),
('Phòng 2'),
('Phòng 3');

-- Insert seats for each auditorium (8 rows A-H, 10 seats per row)
-- Auditorium 1
INSERT INTO seat (row_label, number, seat_type, auditorium_id) VALUES
-- Row A
('A', 1, 'NORMAL', 1), ('A', 2, 'NORMAL', 1), ('A', 3, 'NORMAL', 1), ('A', 4, 'NORMAL', 1), ('A', 5, 'NORMAL', 1),
('A', 6, 'NORMAL', 1), ('A', 7, 'NORMAL', 1), ('A', 8, 'NORMAL', 1), ('A', 9, 'NORMAL', 1), ('A', 10, 'NORMAL', 1),
-- Row B
('B', 1, 'NORMAL', 1), ('B', 2, 'NORMAL', 1), ('B', 3, 'NORMAL', 1), ('B', 4, 'NORMAL', 1), ('B', 5, 'NORMAL', 1),
('B', 6, 'NORMAL', 1), ('B', 7, 'NORMAL', 1), ('B', 8, 'NORMAL', 1), ('B', 9, 'NORMAL', 1), ('B', 10, 'NORMAL', 1),
-- Row C
('C', 1, 'NORMAL', 1), ('C', 2, 'NORMAL', 1), ('C', 3, 'NORMAL', 1), ('C', 4, 'NORMAL', 1), ('C', 5, 'NORMAL', 1),
('C', 6, 'NORMAL', 1), ('C', 7, 'NORMAL', 1), ('C', 8, 'NORMAL', 1), ('C', 9, 'NORMAL', 1), ('C', 10, 'NORMAL', 1),
-- Row D
('D', 1, 'NORMAL', 1), ('D', 2, 'NORMAL', 1), ('D', 3, 'NORMAL', 1), ('D', 4, 'NORMAL', 1), ('D', 5, 'NORMAL', 1),
('D', 6, 'NORMAL', 1), ('D', 7, 'NORMAL', 1), ('D', 8, 'NORMAL', 1), ('D', 9, 'NORMAL', 1), ('D', 10, 'NORMAL', 1),
-- Row E
('E', 1, 'NORMAL', 1), ('E', 2, 'NORMAL', 1), ('E', 3, 'NORMAL', 1), ('E', 4, 'NORMAL', 1), ('E', 5, 'NORMAL', 1),
('E', 6, 'NORMAL', 1), ('E', 7, 'NORMAL', 1), ('E', 8, 'NORMAL', 1), ('E', 9, 'NORMAL', 1), ('E', 10, 'NORMAL', 1),
-- Row F
('F', 1, 'NORMAL', 1), ('F', 2, 'NORMAL', 1), ('F', 3, 'NORMAL', 1), ('F', 4, 'NORMAL', 1), ('F', 5, 'NORMAL', 1),
('F', 6, 'NORMAL', 1), ('F', 7, 'NORMAL', 1), ('F', 8, 'NORMAL', 1), ('F', 9, 'NORMAL', 1), ('F', 10, 'NORMAL', 1),
-- Row G (Sweetbox)
('G', 1, 'SWEETBOX', 1), ('G', 2, 'SWEETBOX', 1), ('G', 3, 'SWEETBOX', 1), ('G', 4, 'SWEETBOX', 1), ('G', 5, 'SWEETBOX', 1),
('G', 6, 'SWEETBOX', 1), ('G', 7, 'SWEETBOX', 1), ('G', 8, 'SWEETBOX', 1), ('G', 9, 'SWEETBOX', 1), ('G', 10, 'SWEETBOX', 1),
-- Row H (Sweetbox)
('H', 1, 'SWEETBOX', 1), ('H', 2, 'SWEETBOX', 1), ('H', 3, 'SWEETBOX', 1), ('H', 4, 'SWEETBOX', 1), ('H', 5, 'SWEETBOX', 1),
('H', 6, 'SWEETBOX', 1), ('H', 7, 'SWEETBOX', 1), ('H', 8, 'SWEETBOX', 1), ('H', 9, 'SWEETBOX', 1), ('H', 10, 'SWEETBOX', 1);

-- Auditorium 2
INSERT INTO seat (row_label, number, seat_type, auditorium_id) VALUES
-- Row A
('A', 1, 'NORMAL', 2), ('A', 2, 'NORMAL', 2), ('A', 3, 'NORMAL', 2), ('A', 4, 'NORMAL', 2), ('A', 5, 'NORMAL', 2),
('A', 6, 'NORMAL', 2), ('A', 7, 'NORMAL', 2), ('A', 8, 'NORMAL', 2), ('A', 9, 'NORMAL', 2), ('A', 10, 'NORMAL', 2),
-- Row B
('B', 1, 'NORMAL', 2), ('B', 2, 'NORMAL', 2), ('B', 3, 'NORMAL', 2), ('B', 4, 'NORMAL', 2), ('B', 5, 'NORMAL', 2),
('B', 6, 'NORMAL', 2), ('B', 7, 'NORMAL', 2), ('B', 8, 'NORMAL', 2), ('B', 9, 'NORMAL', 2), ('B', 10, 'NORMAL', 2),
-- Row C
('C', 1, 'NORMAL', 2), ('C', 2, 'NORMAL', 2), ('C', 3, 'NORMAL', 2), ('C', 4, 'NORMAL', 2), ('C', 5, 'NORMAL', 2),
('C', 6, 'NORMAL', 2), ('C', 7, 'NORMAL', 2), ('C', 8, 'NORMAL', 2), ('C', 9, 'NORMAL', 2), ('C', 10, 'NORMAL', 2),
-- Row D
('D', 1, 'NORMAL', 2), ('D', 2, 'NORMAL', 2), ('D', 3, 'NORMAL', 2), ('D', 4, 'NORMAL', 2), ('D', 5, 'NORMAL', 2),
('D', 6, 'NORMAL', 2), ('D', 7, 'NORMAL', 2), ('D', 8, 'NORMAL', 2), ('D', 9, 'NORMAL', 2), ('D', 10, 'NORMAL', 2),
-- Row E
('E', 1, 'NORMAL', 2), ('E', 2, 'NORMAL', 2), ('E', 3, 'NORMAL', 2), ('E', 4, 'NORMAL', 2), ('E', 5, 'NORMAL', 2),
('E', 6, 'NORMAL', 2), ('E', 7, 'NORMAL', 2), ('E', 8, 'NORMAL', 2), ('E', 9, 'NORMAL', 2), ('E', 10, 'NORMAL', 2),
-- Row F
('F', 1, 'NORMAL', 2), ('F', 2, 'NORMAL', 2), ('F', 3, 'NORMAL', 2), ('F', 4, 'NORMAL', 2), ('F', 5, 'NORMAL', 2),
('F', 6, 'NORMAL', 2), ('F', 7, 'NORMAL', 2), ('F', 8, 'NORMAL', 2), ('F', 9, 'NORMAL', 2), ('F', 10, 'NORMAL', 2),
-- Row G (Sweetbox)
('G', 1, 'SWEETBOX', 2), ('G', 2, 'SWEETBOX', 2), ('G', 3, 'SWEETBOX', 2), ('G', 4, 'SWEETBOX', 2), ('G', 5, 'SWEETBOX', 2),
('G', 6, 'SWEETBOX', 2), ('G', 7, 'SWEETBOX', 2), ('G', 8, 'SWEETBOX', 2), ('G', 9, 'SWEETBOX', 2), ('G', 10, 'SWEETBOX', 2),
-- Row H (Sweetbox)
('H', 1, 'SWEETBOX', 2), ('H', 2, 'SWEETBOX', 2), ('H', 3, 'SWEETBOX', 2), ('H', 4, 'SWEETBOX', 2), ('H', 5, 'SWEETBOX', 2),
('H', 6, 'SWEETBOX', 2), ('H', 7, 'SWEETBOX', 2), ('H', 8, 'SWEETBOX', 2), ('H', 9, 'SWEETBOX', 2), ('H', 10, 'SWEETBOX', 2);

-- Auditorium 3
INSERT INTO seat (row_label, number, seat_type, auditorium_id) VALUES
-- Row A
('A', 1, 'NORMAL', 3), ('A', 2, 'NORMAL', 3), ('A', 3, 'NORMAL', 3), ('A', 4, 'NORMAL', 3), ('A', 5, 'NORMAL', 3),
('A', 6, 'NORMAL', 3), ('A', 7, 'NORMAL', 3), ('A', 8, 'NORMAL', 3), ('A', 9, 'NORMAL', 3), ('A', 10, 'NORMAL', 3),
-- Row B
('B', 1, 'NORMAL', 3), ('B', 2, 'NORMAL', 3), ('B', 3, 'NORMAL', 3), ('B', 4, 'NORMAL', 3), ('B', 5, 'NORMAL', 3),
('B', 6, 'NORMAL', 3), ('B', 7, 'NORMAL', 3), ('B', 8, 'NORMAL', 3), ('B', 9, 'NORMAL', 3), ('B', 10, 'NORMAL', 3),
-- Row C
('C', 1, 'NORMAL', 3), ('C', 2, 'NORMAL', 3), ('C', 3, 'NORMAL', 3), ('C', 4, 'NORMAL', 3), ('C', 5, 'NORMAL', 3),
('C', 6, 'NORMAL', 3), ('C', 7, 'NORMAL', 3), ('C', 8, 'NORMAL', 3), ('C', 9, 'NORMAL', 3), ('C', 10, 'NORMAL', 3),
-- Row D
('D', 1, 'NORMAL', 3), ('D', 2, 'NORMAL', 3), ('D', 3, 'NORMAL', 3), ('D', 4, 'NORMAL', 3), ('D', 5, 'NORMAL', 3),
('D', 6, 'NORMAL', 3), ('D', 7, 'NORMAL', 3), ('D', 8, 'NORMAL', 3), ('D', 9, 'NORMAL', 3), ('D', 10, 'NORMAL', 3),
-- Row E
('E', 1, 'NORMAL', 3), ('E', 2, 'NORMAL', 3), ('E', 3, 'NORMAL', 3), ('E', 4, 'NORMAL', 3), ('E', 5, 'NORMAL', 3),
('E', 6, 'NORMAL', 3), ('E', 7, 'NORMAL', 3), ('E', 8, 'NORMAL', 3), ('E', 9, 'NORMAL', 3), ('E', 10, 'NORMAL', 3),
-- Row F
('F', 1, 'NORMAL', 3), ('F', 2, 'NORMAL', 3), ('F', 3, 'NORMAL', 3), ('F', 4, 'NORMAL', 3), ('F', 5, 'NORMAL', 3),
('F', 6, 'NORMAL', 3), ('F', 7, 'NORMAL', 3), ('F', 8, 'NORMAL', 3), ('F', 9, 'NORMAL', 3), ('F', 10, 'NORMAL', 3),
-- Row G (Sweetbox)
('G', 1, 'SWEETBOX', 3), ('G', 2, 'SWEETBOX', 3), ('G', 3, 'SWEETBOX', 3), ('G', 4, 'SWEETBOX', 3), ('G', 5, 'SWEETBOX', 3),
('G', 6, 'SWEETBOX', 3), ('G', 7, 'SWEETBOX', 3), ('G', 8, 'SWEETBOX', 3), ('G', 9, 'SWEETBOX', 3), ('G', 10, 'SWEETBOX', 3),
-- Row H (Sweetbox)
('H', 1, 'SWEETBOX', 3), ('H', 2, 'SWEETBOX', 3), ('H', 3, 'SWEETBOX', 3), ('H', 4, 'SWEETBOX', 3), ('H', 5, 'SWEETBOX', 3),
('H', 6, 'SWEETBOX', 3), ('H', 7, 'SWEETBOX', 3), ('H', 8, 'SWEETBOX', 3), ('H', 9, 'SWEETBOX', 3), ('H', 10, 'SWEETBOX', 3);

-- Insert screenings
INSERT INTO screening (start_time, end_time, format, status, movie_id, auditorium_id) VALUES
('2024-01-20 10:00:00', '2024-01-20 12:30:00', 'TwoD', 'ACTIVE', 1, 1),
('2024-01-20 14:00:00', '2024-01-20 16:30:00', 'TwoD', 'ACTIVE', 1, 1),
('2024-01-20 18:00:00', '2024-01-20 20:30:00', 'TwoD', 'ACTIVE', 1, 1),
('2024-01-20 10:30:00', '2024-01-20 13:00:00', 'TwoD', 'ACTIVE', 2, 2),
('2024-01-20 15:00:00', '2024-01-20 17:30:00', 'TwoD', 'ACTIVE', 2, 2),
('2024-01-20 19:00:00', '2024-01-20 21:30:00', 'TwoD', 'ACTIVE', 2, 2),
('2024-01-20 11:00:00', '2024-01-20 13:30:00', 'ThreeD', 'ACTIVE', 3, 3),
('2024-01-20 16:00:00', '2024-01-20 18:30:00', 'ThreeD', 'ACTIVE', 3, 3),
('2024-01-20 20:00:00', '2024-01-20 22:30:00', 'ThreeD', 'ACTIVE', 3, 3);

