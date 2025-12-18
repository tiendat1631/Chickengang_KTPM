package com.example.movie.security;

import com.example.movie.dto.response.CustomAccessDeniedHandler;
import com.example.movie.dto.response.CustomAuthenticationEntryPoint;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@EnableMethodSecurity
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final CustomAccessDeniedHandler customAccessDeniedHandler;
    private final CustomAuthenticationEntryPoint customAuthenticationEntryPoint;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthenticationFilter jwtFilter)
            throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth
                        // all roles can crud movie
                        .requestMatchers("/api/v1/auth/**").permitAll()

                        // Cho phép xem phim không cần login (GET)
                        .requestMatchers(HttpMethod.GET, "/api/v1/movies/**").permitAll()

                        // chỉ admin mới được crud
                        // Chỉ ADMIN được phép thêm/sửa/xoá
                        .requestMatchers(HttpMethod.POST, "/api/v1/movies/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/movies/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/api/v1/movies/**").hasRole("ADMIN")

                        // USER MANAGEMENT
                        // Allow user registration (POST) without authentication
                        .requestMatchers(HttpMethod.POST, "/api/v1/users").hasRole("ADMIN")
                        // Admin-only operations for user management
                        .requestMatchers(HttpMethod.GET, "/api/v1/users/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/api/v1/users/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/users/**").hasRole("ADMIN")

                        // AUDITORIUM
                        // Allow viewing auditoriums without authentication (GET)
                        .requestMatchers(HttpMethod.GET, "/api/v1/auditoriums/**").permitAll()
                        // Admin-only operations for auditorium management
                        .requestMatchers(HttpMethod.POST, "/api/v1/auditoriums/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/api/v1/auditoriums/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/auditoriums/**").hasRole("ADMIN")

                        // SCREENING
                        .requestMatchers(HttpMethod.GET, "/api/v1/screenings/**").permitAll()
                        // Chỉ ADMIN mới được phép tạo/sửa/xoá suất chiếu
                        .requestMatchers(HttpMethod.POST, "/api/v1/screenings/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/api/v1/screenings/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/screenings/**").hasRole("ADMIN")

                        // BOOKING - Require authentication
                        .requestMatchers("/api/v1/bookings/**").authenticated()

                        // PAYMENT - Require authentication
                        .requestMatchers("/api/v1/payments/**").authenticated()

                        .anyRequest().authenticated())
                .exceptionHandling(ex -> ex
                        .accessDeniedHandler(customAccessDeniedHandler)
                        .authenticationEntryPoint(customAuthenticationEntryPoint))

                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .httpBasic(Customizer.withDefaults())
                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Allow specific origins (local development and Docker)
        // Allow specific origins (local development and Docker)
        // configuration.addAllowedOrigin("http://localhost:3000");
        // configuration.addAllowedOrigin("http://127.0.0.1:3000");

        // Use allowedOriginPatterns instead of allowedOrigins to allow wildcard with
        // credentials
        configuration.addAllowedOriginPattern("*");

        // Allow all HTTP methods
        configuration.addAllowedMethod("*");

        // Allow all headers
        configuration.addAllowedHeader("*");

        // Allow credentials (cookies, authorization headers)
        configuration.setAllowCredentials(true);

        // Expose headers that frontend can access
        configuration.addExposedHeader("Authorization");
        configuration.addExposedHeader("Content-Type");

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }


}
