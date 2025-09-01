// src/main/java/com/carrental/repository/RefreshTokenRepository.java
package com.carrental.repository;

import com.carrental.model.RefreshToken;
import com.carrental.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);
    List<RefreshToken> findAllByUser(User user); // ADD THIS LINE
}