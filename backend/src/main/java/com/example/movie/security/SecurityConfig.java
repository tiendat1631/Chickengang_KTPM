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


@EnableMethodSecurity
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final CustomAccessDeniedHandler customAccessDeniedHandler;
    private final CustomAuthenticationEntryPoint customAuthenticationEntryPoint;
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthenticationFilter jwtFilter) throws Exception {
        return http
                .csrf(csrf->csrf.disable())
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

                        //CREATE USER
                        .requestMatchers(HttpMethod.POST,"/api/v1/users/**").hasRole("ADMIN")


                        // AUDITORIUM
                        .requestMatchers(HttpMethod.POST,"/api/v1/auditoriums/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH,"/api/v1/auditoriums/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE,"/api/v1/auditoriums/**").hasRole("ADMIN")


                        .anyRequest().authenticated()
                )
                .exceptionHandling(ex->ex
                        .accessDeniedHandler(customAccessDeniedHandler)
                        .authenticationEntryPoint(customAuthenticationEntryPoint)
                )


                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .httpBasic(Customizer.withDefaults())
                .build();
    }
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
