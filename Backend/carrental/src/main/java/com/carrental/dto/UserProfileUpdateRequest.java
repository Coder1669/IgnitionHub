// src/main/java/com/carrental/dto/UserProfileUpdateRequest.java
package com.carrental.dto;

public class UserProfileUpdateRequest {
    private String name;
    private String phone;
    private String address;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
}
