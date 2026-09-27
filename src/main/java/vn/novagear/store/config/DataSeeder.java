package vn.novagear.store.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import vn.novagear.store.model.*;
import vn.novagear.store.repository.*;
import java.math.BigDecimal;
import java.util.List;

@Configuration
public class DataSeeder {
    @Bean CommandLineRunner seed(UserRepository users, ProductRepository products, PasswordEncoder encoder){return args->{
        if(users.count()==0){users.save(new AppUser("admin",encoder.encode("admin123"),"Quản trị NovaGear","admin@novagear.vn","ADMIN"));users.save(new AppUser("user",encoder.encode("user123"),"Khách hàng demo","user@novagear.vn","USER"));}
        if(products.count()==0) products.saveAll(List.of(
            p("AMD Ryzen 7 7800X3D","CPU","AMD",9290000,10490000,18,"8 nhân · 16 luồng · 96MB cache","AM5","CPU",true),
            p("Intel Core i5-14600KF","CPU","Intel",6990000,7490000,25,"14 nhân · Turbo 5.3GHz · 125W","LGA1700","CPU",true),
            p("ASUS TUF B650M-Plus WiFi","Mainboard","ASUS",4990000,5390000,12,"B650 · DDR5 · WiFi 6 · mATX","AM5","MB",true),
            p("MSI Pro B760M-A WiFi","Mainboard","MSI",4190000,4590000,9,"B760 · DDR5 · WiFi 6E · mATX","LGA1700","MB",false),
            p("Gigabyte RTX 4070 Super Windforce","VGA","Gigabyte",17990000,19490000,7,"12GB GDDR6X · 220W · 3 quạt",null,"GPU",true),
            p("Sapphire Radeon RX 7800 XT Pulse","VGA","Sapphire",14490000,15990000,11,"16GB GDDR6 · 256-bit · 2 quạt",null,"GPU",false),
            p("Kingston Fury Beast DDR5 32GB","RAM","Kingston",2390000,2690000,40,"2×16GB · 6000MHz · CL36",null,"RAM",true),
            p("Samsung 990 EVO Plus 1TB","SSD","Samsung",2490000,2890000,33,"NVMe Gen4 · đọc 7.250MB/s",null,"SSD",false),
            p("Corsair RM850e ATX 3.0","PSU","Corsair",3190000,3490000,16,"850W · 80 Plus Gold · Full modular",null,"PSU",false),
            p("Montech Air 100 ARGB","Case","Montech",1490000,1690000,21,"mATX · 4 fan ARGB · kính cường lực",null,"CASE",false),
            p("LG UltraGear 27GR75Q-B","Màn hình","LG",6290000,6990000,14,"27 inch · QHD · IPS · 165Hz",null,"MON",true),
            p("Keychron V1 Max","Bàn phím","Keychron",2790000,2990000,8,"75% · Wireless · Hot-swap · QMK",null,"KEY",false)
        ));
    };}
    private Product p(String n,String c,String b,long price,long old,int stock,String specs,String socket,String icon,boolean featured){Product p=new Product();p.setName(n);p.setCategory(c);p.setBrand(b);p.setPrice(BigDecimal.valueOf(price));p.setOldPrice(BigDecimal.valueOf(old));p.setStock(stock);p.setSpecs(specs);p.setSocket(socket);p.setIcon(icon);p.setFeatured(featured);return p;}
}
