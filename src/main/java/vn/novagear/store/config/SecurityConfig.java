package vn.novagear.store.config;

import org.springframework.context.annotation.*;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import vn.novagear.store.repository.UserRepository;

@Configuration
public class SecurityConfig {
    @Bean PasswordEncoder passwordEncoder(){ return new BCryptPasswordEncoder(); }
    @Bean UserDetailsService userDetailsService(UserRepository users){ return username -> users.findByUsername(username)
        .map(u -> User.withUsername(u.getUsername()).password(u.getPassword()).roles(u.getRole()).build())
        .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy tài khoản")); }
    @Bean SecurityFilterChain security(HttpSecurity http) throws Exception {
        return http.csrf(csrf->csrf.disable()).authorizeHttpRequests(auth->auth
            .requestMatchers("/", "/index.html", "/app.js", "/scene.js", "/styles.css", "/tokens.css", "/api/products/**", "/api/consultations", "/api/register", "/api/assistant/**").permitAll()
            .requestMatchers("/api/admin/**").hasRole("ADMIN")
            .anyRequest().authenticated())
            .httpBasic(Customizer.withDefaults()).build();
    }
}
