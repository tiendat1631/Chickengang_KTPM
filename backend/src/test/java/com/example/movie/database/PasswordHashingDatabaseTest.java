package com.example.movie.database;

import com.example.movie.model.User;
import com.example.movie.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Database Tests - Password Security
 * 
 * Test Case:
 * - Password Hashing: Verify password column stores bcrypt hash, not plain text
 * - Direct DB Inspection
 */
@SpringBootTest
@ActiveProfiles("test")
@Transactional
class PasswordHashingDatabaseTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    @DisplayName("Password stored in DB should be bcrypt hashed, not plain text")
    void passwordInDatabase_ShouldBeBcryptHashed_NotPlainText() {
        // Arrange
        String plainPassword = "MySecretPassword123!";
        String hashedPassword = passwordEncoder.encode(plainPassword);

        User user = new User();
        user.setUsername("dbtest_user_" + System.currentTimeMillis());
        user.setEmail("dbtest_" + System.currentTimeMillis() + "@example.com");
        user.setPassword(hashedPassword);
        user.setPhoneNumber("0123456789");
        user.setAddress("Test Address");
        user.setRole(User.UserRole.CUSTOMER);
        user.setIsActive(true);

        // Act
        User savedUser = userRepository.save(user);

        // Assert - Fetch from DB and verify password is hashed
        Optional<User> dbUser = userRepository.findById(savedUser.getId());
        assertTrue(dbUser.isPresent(), "User should exist in database");

        String storedPassword = dbUser.get().getPassword();

        // 1. Password should NOT be plain text
        assertNotEquals(plainPassword, storedPassword,
                "Password should NOT be stored as plain text!");

        // 2. Password should start with bcrypt prefix ($2a$, $2b$, or $2y$)
        assertTrue(storedPassword.startsWith("$2a$") ||
                storedPassword.startsWith("$2b$") ||
                storedPassword.startsWith("$2y$"),
                "Password should be bcrypt hashed (start with $2a$, $2b$, or $2y$). " +
                        "Actual: " + storedPassword.substring(0, Math.min(10, storedPassword.length())));

        // 3. Bcrypt hash should be 60 characters
        assertEquals(60, storedPassword.length(),
                "Bcrypt hash should be 60 characters long");

        // 4. Password encoder should be able to verify the hash
        assertTrue(passwordEncoder.matches(plainPassword, storedPassword),
                "PasswordEncoder should verify the stored hash matches original password");
    }

    @Test
    @DisplayName("Same password should produce different hashes (salt randomness)")
    void samePassword_ShouldProduceDifferentHashes() {
        // Arrange
        String password = "SamePassword123!";

        // Act
        String hash1 = passwordEncoder.encode(password);
        String hash2 = passwordEncoder.encode(password);

        // Assert - Each hash should be different due to random salt
        assertNotEquals(hash1, hash2,
                "Same password should produce different hashes due to random salt");

        // But both should still verify correctly
        assertTrue(passwordEncoder.matches(password, hash1));
        assertTrue(passwordEncoder.matches(password, hash2));
    }

    @Test
    @DisplayName("Different users with same password should have different hashes in DB")
    void differentUsersWithSamePassword_ShouldHaveDifferentHashes() {
        // Arrange
        String samePassword = "SharedPassword123!";
        long timestamp = System.currentTimeMillis();

        User user1 = new User();
        user1.setUsername("user1_" + timestamp);
        user1.setEmail("user1_" + timestamp + "@example.com");
        user1.setPassword(passwordEncoder.encode(samePassword));
        user1.setPhoneNumber("0123456781");
        user1.setAddress("Address 1");
        user1.setRole(User.UserRole.CUSTOMER);
        user1.setIsActive(true);

        User user2 = new User();
        user2.setUsername("user2_" + timestamp);
        user2.setEmail("user2_" + timestamp + "@example.com");
        user2.setPassword(passwordEncoder.encode(samePassword));
        user2.setPhoneNumber("0123456782");
        user2.setAddress("Address 2");
        user2.setRole(User.UserRole.CUSTOMER);
        user2.setIsActive(true);

        // Act
        userRepository.save(user1);
        userRepository.save(user2);

        // Assert
        Optional<User> dbUser1 = userRepository.findByUsername(user1.getUsername());
        Optional<User> dbUser2 = userRepository.findByUsername(user2.getUsername());

        assertTrue(dbUser1.isPresent() && dbUser2.isPresent());

        assertNotEquals(dbUser1.get().getPassword(), dbUser2.get().getPassword(),
                "Users with same password should have different hashes in database");
    }

    @Test
    @DisplayName("Password hash should not contain original password substring")
    void passwordHash_ShouldNotContainOriginalPassword() {
        // Arrange
        String password = "TestPassword123";

        // Act
        String hash = passwordEncoder.encode(password);

        // Assert - Hash should not contain any recognizable part of password
        assertFalse(hash.toLowerCase().contains("test"),
                "Hash should not contain password substring");
        assertFalse(hash.toLowerCase().contains("password"),
                "Hash should not contain password substring");
        assertFalse(hash.contains("123"),
                "Hash should not contain password substring");
    }

    @Test
    @DisplayName("Empty password should still be hashed, not stored empty")
    void emptyPassword_ShouldStillBeHashed() {
        // Arrange
        String emptyPassword = "";

        // Act
        String hash = passwordEncoder.encode(emptyPassword);

        // Assert
        assertNotEquals("", hash, "Empty password should still produce a hash");
        assertEquals(60, hash.length(), "Empty password hash should still be 60 chars");
        assertTrue(hash.startsWith("$2a$") || hash.startsWith("$2b$") || hash.startsWith("$2y$"));
    }
}
