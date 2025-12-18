-- Seed initial data for development (idempotent by clearing tables first)
-- Note: Hibernate creates/updates schema (ddl-auto=update). This runs after that.

-- Clear existing data (development only)
SET FOREIGN_KEY_CHECKS=0;
DELETE FROM movie;
DELETE FROM `users`;
SET FOREIGN_KEY_CHECKS=1;

-- Reset AUTO_INCREMENT counters
ALTER TABLE movie AUTO_INCREMENT = 1;
ALTER TABLE `users` AUTO_INCREMENT = 1;

INSERT INTO movie (title, director, actors, genres, release_date, duration, language, rated, description, status) VALUES
('The Shawshank Redemption', 'Frank Darabont', 'Tim Robbins, Morgan Freeman', 'Drama', '1994-09-23', '142 min', 'English', 'R', 'Two imprisoned men bond over a number of years, finding solace and eventual redemption.', 'NOW_SHOWING'),
('The Godfather', 'Francis Ford Coppola', 'Marlon Brando, Al Pacino', 'Crime, Drama', '1972-03-24', '175 min', 'English', 'R', 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.', 'NOW_SHOWING'),
('The Dark Knight', 'Christopher Nolan', 'Christian Bale, Heath Ledger', 'Action, Crime, Drama', '2008-07-18', '152 min', 'English', 'PG-13', 'Batman faces the Joker, a criminal mastermind who plunges Gotham into anarchy.', 'NOW_SHOWING'),
('Inception', 'Christopher Nolan', 'Leonardo DiCaprio, Joseph Gordon-Levitt', 'Action, Sci-Fi, Thriller', '2010-07-16', '148 min', 'English', 'PG-13', 'A thief who steals corporate secrets through dream-sharing technology is given an inverse task of planting an idea.', 'NOW_SHOWING'),
('Interstellar', 'Christopher Nolan', 'Matthew McConaughey, Anne Hathaway', 'Adventure, Drama, Sci-Fi', '2014-11-07', '169 min', 'English', 'PG-13', 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity''s survival.', 'NOW_SHOWING'),
('Parasite', 'Bong Joon-ho', 'Song Kang-ho, Lee Sun-kyun', 'Comedy, Drama, Thriller', '2019-05-30', '132 min', 'Korean', 'R', 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.', 'NOW_SHOWING'),
('Spirited Away', 'Hayao Miyazaki', 'Rumi Hiiragi, Miyu Irino', 'Animation, Adventure, Family', '2001-07-20', '125 min', 'Japanese', 'PG', 'During her family''s move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits.', 'NOW_SHOWING'),
('Avengers: Endgame', 'Anthony Russo, Joe Russo', 'Robert Downey Jr., Chris Evans', 'Action, Adventure, Sci-Fi', '2019-04-26', '181 min', 'English', 'PG-13', 'The Avengers assemble once more in order to undo Thanos'' actions and restore order to the universe.', 'NOW_SHOWING'),
('Dune: Part Two', 'Denis Villeneuve', 'Timothée Chalamet, Zendaya', 'Action, Adventure, Sci-Fi', '2025-03-15', '166 min', 'English', 'PG-13', 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.', 'COMING_SOON'),
('Oppenheimer', 'Christopher Nolan', 'Cillian Murphy, Emily Blunt', 'Biography, Drama, History', '2023-07-21', '180 min', 'English', 'R', 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.', 'NOW_SHOWING'),
('The Batman', 'Matt Reeves', 'Robert Pattinson, Zoë Kravitz', 'Action, Crime, Drama', '2022-03-04', '176 min', 'English', 'PG-13', 'When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city''s hidden corruption.', 'NOW_SHOWING'),
('Spider-Man: No Way Home', 'Jon Watts', 'Tom Holland, Zendaya', 'Action, Adventure, Fantasy', '2021-12-17', '148 min', 'English', 'PG-13', 'With Spider-Man''s identity now revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds start to appear.', 'NOW_SHOWING'),
('Everything Everywhere All at Once', 'Daniel Kwan, Daniel Scheinert', 'Michelle Yeoh, Stephanie Hsu', 'Action, Adventure, Comedy', '2022-03-25', '139 min', 'English', 'R', 'An aging Chinese immigrant is swept up in an insane adventure, where she alone can save the world by exploring other universes.', 'NOW_SHOWING'),
('Top Gun: Maverick', 'Joseph Kosinski', 'Tom Cruise, Miles Teller', 'Action, Drama', '2022-05-27', '130 min', 'English', 'PG-13', 'After thirty years, Maverick is still pushing the envelope as a top naval aviator, but must confront ghosts of his past.', 'NOW_SHOWING'),
('Avatar: The Way of Water', 'James Cameron', 'Sam Worthington, Zoe Saldana', 'Action, Adventure, Fantasy', '2022-12-16', '192 min', 'English', 'PG-13', 'Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started.', 'NOW_SHOWING'),
('Barbie', 'Greta Gerwig', 'Margot Robbie, Ryan Gosling', 'Adventure, Comedy, Fantasy', '2023-07-21', '114 min', 'English', 'PG-13', 'Barbie and Ken are having the time of their lives in the colorful and seemingly perfect world of Barbie Land.', 'NOW_SHOWING'),
('Deadpool 3', 'Shawn Levy', 'Ryan Reynolds, Hugh Jackman', 'Action, Comedy, Sci-Fi', '2025-07-26', '120 min', 'English', 'R', 'Deadpool teams up with Wolverine for an epic adventure across the multiverse.', 'COMING_SOON'),
('The Marvels', 'Nia DaCosta', 'Brie Larson, Teyonah Parris', 'Action, Adventure, Fantasy', '2025-02-10', '105 min', 'English', 'PG-13', 'Carol Danvers, Kamala Khan, and Monica Rambeau swap places with each other every time they use their powers.', 'COMING_SOON'),
('Wonka', 'Paul King', 'Timothée Chalamet, Olivia Colman', 'Adventure, Comedy, Family', '2023-12-15', '116 min', 'English', 'PG', 'The story of how a young Willy Wonka met the Oompa-Loompas and became the world''s greatest inventor and chocolatier.', 'NOW_SHOWING'),
('The Hunger Games: The Ballad of Songbirds & Snakes', 'Francis Lawrence', 'Tom Blyth, Rachel Zegler', 'Action, Adventure, Drama', '2023-11-17', '157 min', 'English', 'PG-13', 'Years before he would become the tyrannical President of Panem, 18-year-old Coriolanus Snow is the last hope for his fading lineage.', 'NOW_SHOWING');

-- Users: store BCrypt-hashed passwords to align with PasswordEncoder
-- Password for both users = "password" (BCrypt pre-hashed)
-- Hash generated with BCrypt (10 rounds). Update if encoder strength changes.
SET @pwd := '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';

INSERT INTO `users` (email, password, phone_number, role, is_active, address, created_at, updated_at, username, date_of_birth) VALUES
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

-- Ensure payment status column can store new enum values (e.g. CANCELLED)
ALTER TABLE payment MODIFY COLUMN status VARCHAR(20) NOT NULL;

-- Insert auditoriums
INSERT INTO auditorium (name, capacity) VALUES
('Phòng 1', 80),
('Phòng 2', 80),
('Phòng 3', 80);

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

-- Insert screenings for the next 7 days
-- Movie 1: The Shawshank Redemption
INSERT INTO screening (start_time, end_time, format, status, movie_id, auditorium_id) VALUES
-- Day 1 (Today)
('2024-12-22 09:00:00', '2024-12-22 11:22:00', 'TwoD', 'ACTIVE', 1, 1),
('2024-12-22 12:00:00', '2024-12-22 14:22:00', 'TwoD', 'ACTIVE', 1, 1),
('2024-12-22 15:00:00', '2024-12-22 17:22:00', 'TwoD', 'ACTIVE', 1, 1),
('2024-12-22 18:00:00', '2024-12-22 20:22:00', 'TwoD', 'ACTIVE', 1, 1),
('2024-12-22 21:00:00', '2024-12-22 23:22:00', 'TwoD', 'ACTIVE', 1, 2),
-- Day 2
('2024-12-23 09:00:00', '2024-12-23 11:22:00', 'TwoD', 'ACTIVE', 1, 1),
('2024-12-23 13:30:00', '2024-12-23 15:52:00', 'TwoD', 'ACTIVE', 1, 2),
('2024-12-23 17:00:00', '2024-12-23 19:22:00', 'TwoD', 'ACTIVE', 1, 1),
('2024-12-23 20:30:00', '2024-12-23 22:52:00', 'TwoD', 'ACTIVE', 1, 2),
-- Day 3
('2024-12-24 10:00:00', '2024-12-24 12:22:00', 'TwoD', 'ACTIVE', 1, 3),
('2024-12-24 14:30:00', '2024-12-24 16:52:00', 'TwoD', 'ACTIVE', 1, 1),
('2024-12-24 18:00:00', '2024-12-24 20:22:00', 'TwoD', 'ACTIVE', 1, 2),
('2024-12-24 21:30:00', '2024-12-24 23:52:00', 'TwoD', 'ACTIVE', 1, 3);

-- Movie 2: The Godfather
INSERT INTO screening (start_time, end_time, format, status, movie_id, auditorium_id) VALUES
-- Day 1
('2024-12-22 09:30:00', '2024-12-22 12:25:00', 'TwoD', 'ACTIVE', 2, 2),
('2024-12-22 13:00:00', '2024-12-22 15:55:00', 'TwoD', 'ACTIVE', 2, 3),
('2024-12-22 16:30:00', '2024-12-22 19:25:00', 'TwoD', 'ACTIVE', 2, 2),
('2024-12-22 20:00:00', '2024-12-22 22:55:00', 'TwoD', 'ACTIVE', 2, 3),
-- Day 2
('2024-12-23 09:00:00', '2024-12-23 11:55:00', 'TwoD', 'ACTIVE', 2, 1),
('2024-12-23 12:30:00', '2024-12-23 15:25:00', 'TwoD', 'ACTIVE', 2, 3),
('2024-12-23 16:00:00', '2024-12-23 18:55:00', 'TwoD', 'ACTIVE', 2, 2),
('2024-12-23 19:30:00', '2024-12-23 22:25:00', 'TwoD', 'ACTIVE', 2, 1),
-- Day 3
('2024-12-24 10:30:00', '2024-12-24 13:25:00', 'TwoD', 'ACTIVE', 2, 3),
('2024-12-24 14:00:00', '2024-12-24 16:55:00', 'TwoD', 'ACTIVE', 2, 2),
('2024-12-24 17:30:00', '2024-12-24 20:25:00', 'TwoD', 'ACTIVE', 2, 1),
('2024-12-24 21:00:00', '2024-12-24 23:55:00', 'TwoD', 'ACTIVE', 2, 3);

-- Movie 3: The Dark Knight
INSERT INTO screening (start_time, end_time, format, status, movie_id, auditorium_id) VALUES
-- Day 1
('2024-12-22 09:00:00', '2024-12-22 11:32:00', 'ThreeD', 'ACTIVE', 3, 3),
('2024-12-22 12:30:00', '2024-12-22 15:02:00', 'ThreeD', 'ACTIVE', 3, 1),
('2024-12-22 15:30:00', '2024-12-22 18:02:00', 'ThreeD', 'ACTIVE', 3, 2),
('2024-12-22 19:00:00', '2024-12-22 21:32:00', 'IMAX', 'ACTIVE', 3, 3),
('2024-12-22 22:00:00', '2024-12-23 00:32:00', 'ThreeD', 'ACTIVE', 3, 1),
-- Day 2
('2024-12-23 09:30:00', '2024-12-23 12:02:00', 'ThreeD', 'ACTIVE', 3, 2),
('2024-12-23 13:00:00', '2024-12-23 15:32:00', 'IMAX', 'ACTIVE', 3, 3),
('2024-12-23 16:30:00', '2024-12-23 19:02:00', 'ThreeD', 'ACTIVE', 3, 1),
('2024-12-23 20:00:00', '2024-12-23 22:32:00', 'ThreeD', 'ACTIVE', 3, 2),
-- Day 3
('2024-12-24 10:00:00', '2024-12-24 12:32:00', 'ThreeD', 'ACTIVE', 3, 1),
('2024-12-24 14:30:00', '2024-12-24 17:02:00', 'IMAX', 'ACTIVE', 3, 3),
('2024-12-24 18:00:00', '2024-12-24 20:32:00', 'ThreeD', 'ACTIVE', 3, 2),
('2024-12-24 21:30:00', '2024-12-24 23:32:00', 'IMAX', 'ACTIVE', 3, 1);

-- Movie 4: Inception
INSERT INTO screening (start_time, end_time, format, status, movie_id, auditorium_id) VALUES
-- Day 1
('2024-12-22 10:00:00', '2024-12-22 12:28:00', 'ThreeD', 'ACTIVE', 4, 2),
('2024-12-22 13:30:00', '2024-12-22 15:58:00', 'ThreeD', 'ACTIVE', 4, 1),
('2024-12-22 17:00:00', '2024-12-22 19:28:00', 'IMAX', 'ACTIVE', 4, 3),
('2024-12-22 20:30:00', '2024-12-22 22:58:00', 'ThreeD', 'ACTIVE', 4, 2),
-- Day 2
('2024-12-23 09:00:00', '2024-12-23 11:28:00', 'ThreeD', 'ACTIVE', 4, 3),
('2024-12-23 12:30:00', '2024-12-23 14:58:00', 'ThreeD', 'ACTIVE', 4, 2),
('2024-12-23 16:00:00', '2024-12-23 18:28:00', 'IMAX', 'ACTIVE', 4, 1),
('2024-12-23 19:30:00', '2024-12-23 21:58:00', 'ThreeD', 'ACTIVE', 4, 3),
-- Day 3
('2024-12-24 10:00:00', '2024-12-24 12:28:00', 'ThreeD', 'ACTIVE', 4, 1),
('2024-12-24 14:00:00', '2024-12-24 16:28:00', 'IMAX', 'ACTIVE', 4, 3),
('2024-12-24 18:30:00', '2024-12-24 20:58:00', 'ThreeD', 'ACTIVE', 4, 2),
('2024-12-24 22:00:00', '2024-12-25 00:28:00', 'ThreeD', 'ACTIVE', 4, 1);

-- Movie 5: Interstellar
INSERT INTO screening (start_time, end_time, format, status, movie_id, auditorium_id) VALUES
-- Day 1
('2024-12-22 10:00:00', '2024-12-22 12:49:00', 'IMAX', 'ACTIVE', 5, 1),
('2024-12-22 13:30:00', '2024-12-22 16:19:00', 'IMAX', 'ACTIVE', 5, 3),
('2024-12-22 17:00:00', '2024-12-22 19:49:00', 'IMAX', 'ACTIVE', 5, 1),
('2024-12-22 20:30:00', '2024-12-22 23:19:00', 'IMAX', 'ACTIVE', 5, 3),
-- Day 2
('2024-12-23 09:30:00', '2024-12-23 12:19:00', 'IMAX', 'ACTIVE', 5, 2),
('2024-12-23 13:00:00', '2024-12-23 15:49:00', 'IMAX', 'ACTIVE', 5, 1),
('2024-12-23 16:30:00', '2024-12-23 19:19:00', 'IMAX', 'ACTIVE', 5, 3),
('2024-12-23 20:00:00', '2024-12-23 22:49:00', 'IMAX', 'ACTIVE', 5, 2),
-- Day 3
('2024-12-24 10:30:00', '2024-12-24 13:19:00', 'IMAX', 'ACTIVE', 5, 1),
('2024-12-24 14:00:00', '2024-12-24 16:49:00', 'IMAX', 'ACTIVE', 5, 3),
('2024-12-24 17:30:00', '2024-12-24 20:19:00', 'IMAX', 'ACTIVE', 5, 2),
('2024-12-24 21:00:00', '2024-12-24 23:49:00', 'IMAX', 'ACTIVE', 5, 1);

-- Movie 6: Parasite
INSERT INTO screening (start_time, end_time, format, status, movie_id, auditorium_id) VALUES
-- Day 1
('2024-12-22 09:30:00', '2024-12-22 11:42:00', 'TwoD', 'ACTIVE', 6, 2),
('2024-12-22 12:30:00', '2024-12-22 14:42:00', 'TwoD', 'ACTIVE', 6, 3),
('2024-12-22 16:00:00', '2024-12-22 18:12:00', 'TwoD', 'ACTIVE', 6, 1),
('2024-12-22 19:00:00', '2024-12-22 21:12:00', 'TwoD', 'ACTIVE', 6, 2),
-- Day 2
('2024-12-23 10:00:00', '2024-12-23 12:12:00', 'TwoD', 'ACTIVE', 6, 3),
('2024-12-23 13:30:00', '2024-12-23 15:42:00', 'TwoD', 'ACTIVE', 6, 1),
('2024-12-23 17:00:00', '2024-12-23 19:12:00', 'TwoD', 'ACTIVE', 6, 2),
('2024-12-23 20:00:00', '2024-12-23 22:12:00', 'TwoD', 'ACTIVE', 6, 3),
-- Day 3
('2024-12-24 09:00:00', '2024-12-24 11:12:00', 'TwoD', 'ACTIVE', 6, 1),
('2024-12-24 12:30:00', '2024-12-24 14:42:00', 'TwoD', 'ACTIVE', 6, 2),
('2024-12-24 16:00:00', '2024-12-24 18:12:00', 'TwoD', 'ACTIVE', 6, 3),
('2024-12-24 19:30:00', '2024-12-24 21:42:00', 'TwoD', 'ACTIVE', 6, 1);

-- Movie 7: Spirited Away
INSERT INTO screening (start_time, end_time, format, status, movie_id, auditorium_id) VALUES
-- Day 1
('2024-12-22 08:30:00', '2024-12-22 10:35:00', 'TwoD', 'ACTIVE', 7, 3),
('2024-12-22 11:30:00', '2024-12-22 13:35:00', 'TwoD', 'ACTIVE', 7, 1),
('2024-12-22 15:00:00', '2024-12-22 17:05:00', 'TwoD', 'ACTIVE', 7, 2),
('2024-12-22 18:00:00', '2024-12-22 20:05:00', 'TwoD', 'ACTIVE', 7, 3),
('2024-12-22 21:00:00', '2024-12-22 23:05:00', 'TwoD', 'ACTIVE', 7, 1),
-- Day 2
('2024-12-23 09:00:00', '2024-12-23 11:05:00', 'TwoD', 'ACTIVE', 7, 2),
('2024-12-23 12:00:00', '2024-12-23 14:05:00', 'TwoD', 'ACTIVE', 7, 3),
('2024-12-23 16:00:00', '2024-12-23 18:05:00', 'TwoD', 'ACTIVE', 7, 1),
('2024-12-23 19:00:00', '2024-12-23 21:05:00', 'TwoD', 'ACTIVE', 7, 2),
-- Day 3
('2024-12-24 08:00:00', '2024-12-24 10:05:00', 'TwoD', 'ACTIVE', 7, 3),
('2024-12-24 11:30:00', '2024-12-24 13:35:00', 'TwoD', 'ACTIVE', 7, 1),
('2024-12-24 15:00:00', '2024-12-24 17:05:00', 'TwoD', 'ACTIVE', 7, 2),
('2024-12-24 18:30:00', '2024-12-24 20:35:00', 'TwoD', 'ACTIVE', 7, 3);

-- Movie 8: Avengers: Endgame
INSERT INTO screening (start_time, end_time, format, status, movie_id, auditorium_id) VALUES
-- Day 1
('2024-12-22 09:00:00', '2024-12-22 12:01:00', 'ThreeD', 'ACTIVE', 8, 1),
('2024-12-22 13:00:00', '2024-12-22 16:01:00', 'ThreeD', 'ACTIVE', 8, 2),
('2024-12-22 17:00:00', '2024-12-22 20:01:00', 'IMAX', 'ACTIVE', 8, 3),
('2024-12-22 20:30:00', '2024-12-22 23:31:00', 'ThreeD', 'ACTIVE', 8, 1),
-- Day 2
('2024-12-23 09:30:00', '2024-12-23 12:31:00', 'ThreeD', 'ACTIVE', 8, 2),
('2024-12-23 13:30:00', '2024-12-23 16:31:00', 'IMAX', 'ACTIVE', 8, 3),
('2024-12-23 17:30:00', '2024-12-23 20:31:00', 'ThreeD', 'ACTIVE', 8, 1),
('2024-12-23 21:00:00', '2024-12-24 00:01:00', 'IMAX', 'ACTIVE', 8, 2),
-- Day 3
('2024-12-24 10:00:00', '2024-12-24 13:01:00', 'ThreeD', 'ACTIVE', 8, 3),
('2024-12-24 14:30:00', '2024-12-24 17:31:00', 'IMAX', 'ACTIVE', 8, 1),
('2024-12-24 18:00:00', '2024-12-24 21:01:00', 'ThreeD', 'ACTIVE', 8, 2),
('2024-12-24 22:00:00', '2024-12-25 01:01:00', 'IMAX', 'ACTIVE', 8, 3);


-- Movie 10: Oppenheimer
INSERT INTO screening (start_time, end_time, format, status, movie_id, auditorium_id) VALUES
('2024-12-22 10:00:00', '2024-12-22 13:00:00', 'IMAX', 'ACTIVE', 10, 3),
('2024-12-22 14:00:00', '2024-12-22 17:00:00', 'IMAX', 'ACTIVE', 10, 3),
('2024-12-22 18:00:00', '2024-12-22 21:00:00', 'IMAX', 'ACTIVE', 10, 3);

-- Movie 11: The Batman
INSERT INTO screening (start_time, end_time, format, status, movie_id, auditorium_id) VALUES
('2024-12-22 09:00:00', '2024-12-22 11:56:00', 'TwoD', 'ACTIVE', 11, 1),
('2024-12-22 13:00:00', '2024-12-22 15:56:00', 'TwoD', 'ACTIVE', 11, 1);

-- Movie 12: Spider-Man: No Way Home
INSERT INTO screening (start_time, end_time, format, status, movie_id, auditorium_id) VALUES
('2024-12-22 10:00:00', '2024-12-22 12:28:00', 'ThreeD', 'ACTIVE', 12, 2),
('2024-12-22 14:00:00', '2024-12-22 16:28:00', 'ThreeD', 'ACTIVE', 12, 2);

-- Movie 13: Everything Everywhere All at Once
INSERT INTO screening (start_time, end_time, format, status, movie_id, auditorium_id) VALUES
('2024-12-22 11:00:00', '2024-12-22 13:19:00', 'TwoD', 'ACTIVE', 13, 1),
('2024-12-22 15:00:00', '2024-12-22 17:19:00', 'TwoD', 'ACTIVE', 13, 1);

-- Movie 14: Top Gun: Maverick
INSERT INTO screening (start_time, end_time, format, status, movie_id, auditorium_id) VALUES
('2024-12-22 09:30:00', '2024-12-22 11:40:00', 'IMAX', 'ACTIVE', 14, 3),
('2024-12-22 13:30:00', '2024-12-22 15:40:00', 'IMAX', 'ACTIVE', 14, 3);

-- Movie 15: Avatar: The Way of Water
INSERT INTO screening (start_time, end_time, format, status, movie_id, auditorium_id) VALUES
('2024-12-22 09:00:00', '2024-12-22 12:12:00', 'ThreeD', 'ACTIVE', 15, 2),
('2024-12-22 13:00:00', '2024-12-22 16:12:00', 'ThreeD', 'ACTIVE', 15, 2);

-- Movie 16: Barbie
INSERT INTO screening (start_time, end_time, format, status, movie_id, auditorium_id) VALUES
('2024-12-22 10:00:00', '2024-12-22 11:54:00', 'TwoD', 'ACTIVE', 16, 1),
('2024-12-22 14:00:00', '2024-12-22 15:54:00', 'TwoD', 'ACTIVE', 16, 1);

-- Movie 19: Wonka
INSERT INTO screening (start_time, end_time, format, status, movie_id, auditorium_id) VALUES
('2024-12-22 09:00:00', '2024-12-22 10:56:00', 'TwoD', 'ACTIVE', 19, 2),
('2024-12-22 13:00:00', '2024-12-22 14:56:00', 'TwoD', 'ACTIVE', 19, 2);

-- Movie 20: The Hunger Games
INSERT INTO screening (start_time, end_time, format, status, movie_id, auditorium_id) VALUES
('2024-12-22 11:00:00', '2024-12-22 13:37:00', 'TwoD', 'ACTIVE', 20, 1),
('2024-12-22 15:00:00', '2024-12-22 17:37:00', 'TwoD', 'ACTIVE', 20, 1);
