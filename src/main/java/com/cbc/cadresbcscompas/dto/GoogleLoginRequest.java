package com.cbc.cadresbcscompas.dto;

public class GoogleLoginRequest {
    private String name;
    private String email;
    private String uid;
    private String photoUrl;
    private String phone;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getUid() { return uid; }
    public void setUid(String uid) { this.uid = uid; }
    
    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
}
