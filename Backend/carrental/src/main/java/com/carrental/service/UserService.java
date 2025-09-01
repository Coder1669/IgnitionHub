package com.carrental.service;

import com.carrental.dto.PasswordChangeRequest;
import com.carrental.dto.UserProfileUpdateRequest;
import com.carrental.model.User;

import java.util.List;

public interface UserService {

    String encodePassword(String plainPassword);
    
    User registerUser(User user);

    List<User> getAllUsers();

    User getUserByEmail(String email);

    User promoteUserToAdmin(Long id, String adminEmail);

    User updateProfile(String email, UserProfileUpdateRequest req);

    void changePassword(String email, PasswordChangeRequest req);

    User getUserById(Long id);

    void deleteUser(Long id);

    void deleteSelf(String email);

    void deleteAllUsers();
    
    String debugUserDeletion(Long id);
}