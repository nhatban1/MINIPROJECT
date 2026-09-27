package vn.novagear.store.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import vn.novagear.store.model.CustomerOrder;
import vn.novagear.store.service.OrderService;
import java.util.*;

@RestController @RequestMapping("/api")
public class OrderController {
    private final OrderService service; public OrderController(OrderService service){this.service=service;}
    @PostMapping("/orders") public CustomerOrder create(Authentication auth,@RequestBody CustomerOrder order){return service.create(auth.getName(),order);}
    @GetMapping("/orders/mine") public List<CustomerOrder> mine(Authentication auth){return service.mine(auth.getName());}
    @GetMapping("/admin/orders") public List<CustomerOrder> all(){return service.all();}
    @PatchMapping("/admin/orders/{id}/status") public CustomerOrder status(@PathVariable Long id,@RequestBody Map<String,String> body){return service.status(id,body.get("status"));}
}
