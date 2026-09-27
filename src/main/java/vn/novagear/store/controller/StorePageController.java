package vn.novagear.store.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;
import java.util.Map;

@Controller
public class StorePageController {
    @GetMapping("/")
    public String home(Model model) {
        model.addAttribute("storeName", "NOVAGEAR");
        model.addAttribute("storeTagline", "Phần cứng rõ thông số. Cấu hình đúng nhu cầu.");
        model.addAttribute("footerLinks", List.of(
                Map.of("label", "Sản phẩm", "href", "#/products"),
                Map.of("label", "Build PC", "href", "#/build"),
                Map.of("label", "Tư vấn", "href", "#/consult"),
                Map.of("label", "Đơn hàng", "href", "#/orders")));
        return "index";
    }
}
