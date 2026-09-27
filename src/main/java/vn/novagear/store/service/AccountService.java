package vn.novagear.store.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import vn.novagear.store.model.AppUser;
import vn.novagear.store.repository.UserRepository;

@Service
public class AccountService {
    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;

    public AccountService(UserRepository users, PasswordEncoder passwordEncoder) {
        this.users = users;
        this.passwordEncoder = passwordEncoder;
    }

    public AppUser findByUsername(String username) {
        return users.findByUsername(username).orElseThrow();
    }

    public AppUser register(String username, String password, String fullName, String email) {
        if (users.existsByUsername(username)) {
            throw new DuplicateAccountException("Tên đăng nhập đã được sử dụng.");
        }
        if (users.existsByEmailIgnoreCase(email)) {
            throw new DuplicateAccountException("Email đã được đăng ký.");
        }
        return users.save(new AppUser(username, passwordEncoder.encode(password), fullName, email, "USER"));
    }

    public static class DuplicateAccountException extends RuntimeException {
        public DuplicateAccountException(String message) {
            super(message);
        }
    }
}
