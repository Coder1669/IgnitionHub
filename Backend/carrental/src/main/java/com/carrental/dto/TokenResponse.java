// src/main/java/com/carrental/dto/TokenResponse.java
package com.carrental.dto;

public class TokenResponse {
    private String accessToken;
    private String refreshToken;

    public TokenResponse() {}
    public TokenResponse(String accessToken, String refreshToken) {
        this.accessToken = accessToken; this.refreshToken = refreshToken;
    }
    public String getAccessToken() { return accessToken; }
    public String getRefreshToken() { return refreshToken; }
    public void setAccessToken(String accessToken) { this.accessToken = accessToken; }
    public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }
}
