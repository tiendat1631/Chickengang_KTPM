-- Seed initial data for development (idempotent by clearing tables first)
-- Note: Hibernate creates/updates schema (ddl-auto=update). This runs after that.

-- Clear existing data (development only)
SET FOREIGN_KEY_CHECKS=0;
DELETE FROM movie;
DELETE FROM `user`;
SET FOREIGN_KEY_CHECKS=1;

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
-- Password for both users = "Password@123" (BCrypt pre-hashed)
-- Hash generated with BCrypt (10 rounds). Update if encoder strength changes.
SET @pwd := '$2a$10$3a3p5pZr5Qh3lQy3J9HhEehp0Xxw9t9rQI7w0pQx4wQ2x7jV6n6me';

INSERT INTO `user` (email, password, phone_number, role, is_active, address, created_at, updated_at, username, date_of_birth) VALUES
('admin@example.com', @pwd, '0900000000', 'ADMIN', true, 'Admin HQ', NOW(), NOW(), 'admin', '1990-01-01'),
('johndoe@example.com', @pwd, '0911111111', 'CUSTOMER', true, '123 Main St', NOW(), NOW(), 'johndoe', '1995-05-10');


