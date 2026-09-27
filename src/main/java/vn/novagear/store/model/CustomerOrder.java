package vn.novagear.store.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name="customer_orders")
public class CustomerOrder {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    private String username;
    private String customerName;
    private String phone;
    private String address;
    private String status = "Mới";
    private BigDecimal total = BigDecimal.ZERO;
    private LocalDateTime createdAt = LocalDateTime.now();
    @ElementCollection(fetch=FetchType.EAGER) @CollectionTable(name="order_lines", joinColumns=@JoinColumn(name="order_id"))
    private List<OrderLine> lines = new ArrayList<>();
    public Long getId(){return id;} public void setId(Long id){this.id=id;}
    public String getUsername(){return username;} public void setUsername(String username){this.username=username;}
    public String getCustomerName(){return customerName;} public void setCustomerName(String customerName){this.customerName=customerName;}
    public String getPhone(){return phone;} public void setPhone(String phone){this.phone=phone;}
    public String getAddress(){return address;} public void setAddress(String address){this.address=address;}
    public String getStatus(){return status;} public void setStatus(String status){this.status=status;}
    public BigDecimal getTotal(){return total;} public void setTotal(BigDecimal total){this.total=total;}
    public LocalDateTime getCreatedAt(){return createdAt;} public void setCreatedAt(LocalDateTime createdAt){this.createdAt=createdAt;}
    public List<OrderLine> getLines(){return lines;} public void setLines(List<OrderLine> lines){this.lines=lines;}
}
