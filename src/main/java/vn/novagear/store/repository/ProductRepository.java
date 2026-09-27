package vn.novagear.store.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import vn.novagear.store.model.Product;
import java.util.List;
public interface ProductRepository extends JpaRepository<Product,Long> { List<Product> findByActiveTrue(); }
