// src/main/java/com/carrental/repository/UserRepository.java
package com.carrental.repository;

import com.carrental.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    // ADD THIS METHOD - This is the safe way to update the role
    @Transactional
    @Modifying
    @Query("UPDATE User u SET u.role = 'ADMIN' WHERE u.id = :userId")
    void promoteUserToAdmin(@Param("userId") Long userId);
}