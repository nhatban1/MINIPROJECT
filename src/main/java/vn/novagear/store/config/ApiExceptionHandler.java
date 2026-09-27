package vn.novagear.store.config;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import vn.novagear.store.service.AccountService.DuplicateAccountException;
import java.util.*;
@RestControllerAdvice
public class ApiExceptionHandler {
    @ExceptionHandler(DuplicateAccountException.class) public ResponseEntity<Map<String,String>> handleDuplicateAccount(DuplicateAccountException e){return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message",e.getMessage()));}
    @ExceptionHandler(Exception.class) public ResponseEntity<Map<String,String>> handle(Exception e){return ResponseEntity.badRequest().body(Map.of("message",e.getMessage()==null?"Yêu cầu không hợp lệ":e.getMessage()));}
}
