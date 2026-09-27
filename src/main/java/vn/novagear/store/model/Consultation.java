package vn.novagear.store.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

@Entity
public class Consultation {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @NotBlank private String fullName; @NotBlank private String phone; private String need; private String budget;
    private String status="Chờ liên hệ"; private LocalDateTime createdAt=LocalDateTime.now();
    public Long getId(){return id;} public void setId(Long id){this.id=id;}
    public String getFullName(){return fullName;} public void setFullName(String fullName){this.fullName=fullName;}
    public String getPhone(){return phone;} public void setPhone(String phone){this.phone=phone;}
    public String getNeed(){return need;} public void setNeed(String need){this.need=need;}
    public String getBudget(){return budget;} public void setBudget(String budget){this.budget=budget;}
    public String getStatus(){return status;} public void setStatus(String status){this.status=status;}
    public LocalDateTime getCreatedAt(){return createdAt;} public void setCreatedAt(LocalDateTime createdAt){this.createdAt=createdAt;}
}
