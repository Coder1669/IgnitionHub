// src/main/java/com/carrental/dto/ResetPasswordRequest.java
package com.carrental.dto;

public class ResetPasswordRequest {
    private String token;
    private String newPassword;

    public String getToken() { return token; }
    public String getNewPassword() { return newPassword; }
    public void setToken(String token) { this.token = token; }
    public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
}
