// src/main/java/com/carrental/service/MailService.java
package com.carrental.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@carrental.com}")
    private String fromEmail;

    public void send(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            
            mailSender.send(message);
            System.out.println("Email sent successfully to: " + to);
        } catch (Exception e) {
            System.err.println("Failed to send email to " + to + ": " + e.getMessage());
            // In production, you might want to throw an exception or log this properly
            // For development, we'll continue without failing
        }
    }

    // Alternative method for HTML emails if needed
    public void sendHtml(String to, String subject, String htmlBody) {
        try {
            org.springframework.mail.javamail.MimeMessageHelper helper = 
                new org.springframework.mail.javamail.MimeMessageHelper(
                    mailSender.createMimeMessage(), true);
            
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            
            mailSender.send(helper.getMimeMessage());
            System.out.println("HTML Email sent successfully to: " + to);
        } catch (Exception e) {
            System.err.println("Failed to send HTML email to " + to + ": " + e.getMessage());
        }
    }
}