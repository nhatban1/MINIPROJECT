package vn.novagear.store.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;

@Entity
@Table(name = "products")
public class Product {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @NotBlank private String name;
    @NotBlank private String category;
    @NotBlank private String brand;
    @NotNull @DecimalMin("0") private BigDecimal price;
    @DecimalMin("0") private BigDecimal oldPrice;
    @Min(0) private int stock;
    @Column(length = 1000) private String specs;
    private String socket;
    private String icon;
    @Transient private String imageUrl;
    private boolean featured;
    private boolean active = true;

    public Long getId() { return id; } public void setId(Long id) { this.id = id; }
    public String getName() { return name; } public void setName(String name) { this.name = name; }
    public String getCategory() { return category; } public void setCategory(String category) { this.category = category; }
    public String getBrand() { return brand; } public void setBrand(String brand) { this.brand = brand; }
    public BigDecimal getPrice() { return price; } public void setPrice(BigDecimal price) { this.price = price; }
    public BigDecimal getOldPrice() { return oldPrice; } public void setOldPrice(BigDecimal oldPrice) { this.oldPrice = oldPrice; }
    public int getStock() { return stock; } public void setStock(int stock) { this.stock = stock; }
    public String getSpecs() { return specs; } public void setSpecs(String specs) { this.specs = specs; }
    public String getSocket() { return socket; } public void setSocket(String socket) { this.socket = socket; }
    public String getIcon() { return icon; } public void setIcon(String icon) { this.icon = icon; }
    public String getImageUrl() { return imageUrl; } public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public boolean isFeatured() { return featured; } public void setFeatured(boolean featured) { this.featured = featured; }
    public boolean isActive() { return active; } public void setActive(boolean active) { this.active = active; }
}
