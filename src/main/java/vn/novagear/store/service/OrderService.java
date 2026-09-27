package vn.novagear.store.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.novagear.store.model.*;
import vn.novagear.store.repository.*;
import java.math.BigDecimal;
import java.util.*;

@Service
public class OrderService {
    private final OrderRepository orders; private final ProductRepository products;
    public OrderService(OrderRepository orders, ProductRepository products){this.orders=orders;this.products=products;}
    @Transactional public CustomerOrder create(String username, CustomerOrder input){
        BigDecimal total=BigDecimal.ZERO;
        for(OrderLine line:input.getLines()){
            Product p=products.findById(line.getProductId()).orElseThrow();
            if(line.getQuantity()<1 || p.getStock()<line.getQuantity()) throw new IllegalArgumentException("Số lượng tồn kho không đủ");
            line.setProductName(p.getName()); line.setPrice(p.getPrice()); p.setStock(p.getStock()-line.getQuantity());
            total=total.add(p.getPrice().multiply(BigDecimal.valueOf(line.getQuantity())));
        }
        input.setId(null); input.setUsername(username); input.setStatus("Mới"); input.setTotal(total); return orders.save(input);
    }
    public List<CustomerOrder> mine(String username){return orders.findByUsernameOrderByCreatedAtDesc(username);}
    public List<CustomerOrder> all(){return orders.findAll();}
    public CustomerOrder status(Long id,String status){CustomerOrder o=orders.findById(id).orElseThrow();o.setStatus(status);return orders.save(o);}
}
