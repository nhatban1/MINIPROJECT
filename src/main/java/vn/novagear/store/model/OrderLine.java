package vn.novagear.store.model;

import jakarta.persistence.Embeddable;
import java.math.BigDecimal;

@Embeddable
public class OrderLine {
    private Long productId; private String productName; private BigDecimal price; private int quantity;
    public Long getProductId(){return productId;} public void setProductId(Long productId){this.productId=productId;}
    public String getProductName(){return productName;} public void setProductName(String productName){this.productName=productName;}
    public BigDecimal getPrice(){return price;} public void setPrice(BigDecimal price){this.price=price;}
    public int getQuantity(){return quantity;} public void setQuantity(int quantity){this.quantity=quantity;}
}
