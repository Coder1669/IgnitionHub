package com.carrental.repository;

import com.carrental.model.EmailVerificationToken;
import com.carrental.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EmailVerificationTokenRepository extends JpaRepository<EmailVerificationToken, Long> {
    Optional<EmailVerificationToken> findByToken(String token);
    List<EmailVerificationToken> findAllByUser(User user); // ADD THIS LINE
}