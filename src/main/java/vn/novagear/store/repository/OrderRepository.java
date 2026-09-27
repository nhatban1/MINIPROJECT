package vn.novagear.store.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import vn.novagear.store.model.CustomerOrder;
import java.util.List;
public interface OrderRepository extends JpaRepository<CustomerOrder,Long> { List<CustomerOrder> findByUsernameOrderByCreatedAtDesc(String username); }
