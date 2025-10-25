package com.example.movie.security;

import com.example.movie.model.User;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class SecurityUtil {
    private final JwtEncoder jwtEncoder;
    private final JwtDecoder jwtDecoder;
    @Value("${app.jwt.access.expiration-in-seconds}")
    private long jwtAccessExpiration;

    @Value("${app.jwt.access.admin-expiration-in-seconds}")
    private long jwtAdminAccessExpiration;

    @Value("${app.jwt.refresh.expiration-in-seconds}")
    private long jwtRefreshExpiration;

    // key dùng để lưu role của user trong payload của JWT
    public static final String ROLE_KEY = "role";

    // có thể dùng làm key phân biệt refresh token (nếu cần).
    public static final String REFRESH_TOKEN = "refresh_token";

    // Hash Algorithm
    public static final MacAlgorithm JWT_ALGORITHM = MacAlgorithm.HS512;

    // sinh token with role-based expiration
    public String createAccessToken (User user){
        Instant now = Instant.now();

        // Use longer expiration for admin users (8 hours), shorter for regular users (1 hour)
        long expirationSeconds = user.getRole().name().equals("ADMIN") 
            ? jwtAdminAccessExpiration 
            : jwtAccessExpiration;
        
        Instant validity = now.plus(expirationSeconds, ChronoUnit.SECONDS);

        // xây dựng payload
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuedAt(now) //thời điểm token được phát hành
                .expiresAt(validity) // thời điểm token hết hạn
                .subject(user.getUsername())
                .claim(ROLE_KEY, user.getRole().name())
                .build();

        JwsHeader jwsHeader = JwsHeader.with(JWT_ALGORITHM).build();
        return jwtEncoder.encode(JwtEncoderParameters.from(jwsHeader,claims)).getTokenValue();
    }

    public String createRefreshToken (String subject){
        Instant now = Instant.now();
        Instant validity = now.plus(jwtRefreshExpiration, ChronoUnit.SECONDS);

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuedAt(now)
                .expiresAt(validity)
                .subject(subject)
                .build();

        JwsHeader jwsHeader = JwsHeader.with(JWT_ALGORITHM).build();
        return jwtEncoder.encode(JwtEncoderParameters.from(jwsHeader, claims)).getTokenValue();
    }

    public JwtDecoder getJwtDecoder() {
        return jwtDecoder;
    }
}
