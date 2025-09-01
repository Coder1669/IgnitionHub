// src/main/java/com/carrental/repository/PasswordResetTokenRepository.java
package com.carrental.repository;

import com.carrental.model.PasswordResetToken;
import com.carrental.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByToken(String token);
    List<PasswordResetToken> findAllByUser(User user); // ADD THIS LINE
}