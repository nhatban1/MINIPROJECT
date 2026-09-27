package vn.novagear.store.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import vn.novagear.store.model.AppUser;
import vn.novagear.store.service.AccountService;
import java.util.Map;

@RestController @RequestMapping("/api")
public class AccountController {
    private final AccountService accounts;

    public AccountController(AccountService accounts) {
        this.accounts = accounts;
    }

    @GetMapping("/me")
    public Map<String,Object> me(Authentication auth) {
        AppUser user = accounts.findByUsername(auth.getName());
        return Map.of("username", user.getUsername(), "fullName", user.getFullName(), "email", user.getEmail(), "role", user.getRole());
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@Valid @RequestBody RegisterRequest request) {
        AppUser user = accounts.register(request.username(), request.password(), request.fullName(), request.email());
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "username", user.getUsername(), "fullName", user.getFullName(),
                "email", user.getEmail(), "role", user.getRole()));
    }

    public record RegisterRequest(
            @NotBlank @Pattern(regexp = "[a-zA-Z0-9._-]{3,30}", message = "Tên đăng nhập cần từ 3 đến 30 ký tự." ) String username,
            @NotBlank @Size(min = 8, max = 72, message = "Mật khẩu cần từ 8 đến 72 ký tự.") String password,
            @NotBlank @Size(min = 2, max = 100) String fullName,
            @NotBlank @Email String email) {}
}
