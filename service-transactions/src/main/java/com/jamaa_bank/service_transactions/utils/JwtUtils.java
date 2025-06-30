package com.jamaa_bank.service_transactions.utils;

import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtils {
    
    @Value("${jwt.secret}")
    private String secretKey;
    
    private SecretKey key;
    
    public JwtUtils() {
        init();
    }
    
    private void init() {
        this.key = Keys.hmacShaKeyFor(secretKey.getBytes());
    }
    
    public Claims validateToken(String token) {
        try {
            return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
        } catch (JwtException e) {
            throw new RuntimeException("Token JWT invalide", e);
        }
    }
    
    public Long getUserIdFromToken(String token) {
        Claims claims = validateToken(token);
        return claims.get("id", Long.class);
    }
    
    public String getEmailFromToken(String token) {
        Claims claims = validateToken(token);
        return claims.getSubject();
    }
}