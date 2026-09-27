package vn.novagear.store.controller;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import vn.novagear.store.model.Consultation;
import vn.novagear.store.repository.ConsultationRepository;
import java.util.*;

@RestController @RequestMapping("/api")
public class ConsultationController {
    private final ConsultationRepository repo; public ConsultationController(ConsultationRepository repo){this.repo=repo;}
    @PostMapping("/consultations") public Consultation create(@Valid @RequestBody Consultation c){c.setId(null);return repo.save(c);}
    @GetMapping("/admin/consultations") public List<Consultation> all(){return repo.findAll();}
    @PatchMapping("/admin/consultations/{id}") public Consultation update(@PathVariable Long id,@RequestBody Map<String,String> b){Consultation c=repo.findById(id).orElseThrow();c.setStatus(b.get("status"));return repo.save(c);}
    @DeleteMapping("/admin/consultations/{id}") public void delete(@PathVariable Long id){repo.deleteById(id);}
}
