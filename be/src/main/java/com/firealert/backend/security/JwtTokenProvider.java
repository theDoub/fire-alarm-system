package com.firealert.backend.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.security.Keys;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.UUID;
import javax.crypto.SecretKey;

import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;

@Component
public class JwtTokenProvider {
    private final SecretKey signingKey;
    private final long expirationMs;

    public JwtTokenProvider(
        @Value("${app.jwt.secret}") String jwtSecret,
        @Value("${app.jwt.expiration-ms:86400000}") long expirationMs
    ) {
        this.signingKey = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
        this.expirationMs = expirationMs;
    }

    public String generateToken(CustomUserDetails userDetails){
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
            .subject(userDetails.getUsername())
            .claim("userId", userDetails.getId().toString())
            .claim("role", userDetails.getRole().name())
            .issuedAt(now)
            .expiration(expiryDate)
            .signWith(signingKey)
            .compact();
    }

    private Claims getClaims(String token) {
        return Jwts.parser()
            .verifyWith(signingKey)
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }

    public boolean validateToken(String token){
        getClaims(token);
        return true;
    }
    
    public String getEmailFromToken(String token){
        return getClaims(token).getSubject();
    }

    public UUID getUserIdFromToken(String token){
        String userId = getClaims(token).get("userId", String.class);
        return UUID.fromString(userId);
    }
}
