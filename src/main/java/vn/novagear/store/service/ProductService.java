package vn.novagear.store.service;

import org.springframework.stereotype.Service;
import vn.novagear.store.model.Product;
import vn.novagear.store.repository.ProductRepository;
import java.util.List;
import java.util.Map;

@Service
public class ProductService {
    private static final Map<String, List<String>> PRODUCT_IMAGES = Map.of(
        "CPU", List.of("photo-1591799264318-7e6ef8ddb7ea", "photo-1518770660439-4636190af475"),
        "Mainboard", List.of("photo-1518770660439-4636190af475", "photo-1591799264318-7e6ef8ddb7ea"),
        "VGA", List.of("photo-1591488320449-011701bb6704", "photo-1587202372634-32705e3bf49c"),
        "RAM", List.of("photo-1518770660439-4636190af475", "photo-1591799264318-7e6ef8ddb7ea"),
        "SSD", List.of("photo-1518770660439-4636190af475", "photo-1591799264318-7e6ef8ddb7ea"),
        "PSU", List.of("photo-1587202372775-e229f172b9d7", "photo-1587202372634-32705e3bf49c"),
        "Case", List.of("photo-1587202372775-e229f172b9d7", "photo-1587202372634-32705e3bf49c"),
        "Màn hình", List.of("photo-1527443224154-c4a3942d3acf"),
        "Bàn phím", List.of("photo-1587829741301-dc798b83add3", "photo-1587831990711-23ca6441447b")
    );

    private final ProductRepository repo;
    public ProductService(ProductRepository repo){this.repo=repo;}
    public List<Product> publicList(){return repo.findByActiveTrue().stream().map(this::withImage).toList();}
    public List<Product> adminList(){return repo.findAll().stream().map(this::withImage).toList();}
    public Product save(Product p){return withImage(repo.save(p));}
    public Product update(Long id, Product input){ Product p=repo.findById(id).orElseThrow(); input.setId(p.getId()); return withImage(repo.save(input)); }
    public void delete(Long id){repo.deleteById(id);}

    private Product withImage(Product product) {
        List<String> images = PRODUCT_IMAGES.getOrDefault(product.getCategory(), List.of("photo-1593642632823-8f785ba67e45"));
        String image = images.get(Math.floorMod(product.getName().hashCode(), images.size()));
        product.setImageUrl("https://images.unsplash.com/" + image + "?auto=format&fit=crop&w=900&q=82");
        return product;
    }
}
