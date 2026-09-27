package vn.novagear.store.controller;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import vn.novagear.store.model.Product;
import vn.novagear.store.service.ProductService;
import java.util.List;

@RestController @RequestMapping("/api")
public class ProductController {
    private final ProductService service; public ProductController(ProductService service){this.service=service;}
    @GetMapping("/products") public List<Product> products(){return service.publicList();}
    @GetMapping("/admin/products") public List<Product> adminProducts(){return service.adminList();}
    @PostMapping("/admin/products") public Product create(@Valid @RequestBody Product p){p.setId(null);return service.save(p);}
    @PutMapping("/admin/products/{id}") public Product update(@PathVariable Long id,@Valid @RequestBody Product p){return service.update(id,p);}
    @DeleteMapping("/admin/products/{id}") public void delete(@PathVariable Long id){service.delete(id);}
}
