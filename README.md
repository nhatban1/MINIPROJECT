# NovaGear — Spring Boot PC Store

Website thương mại điện tử linh kiện và thiết bị PC theo cấu trúc Maven/Eclipse chuẩn.

## Chạy trong Eclipse

1. `File → Import → Existing Maven Projects` và chọn thư mục này.
2. Chạy `NovaGearApplication.java` bằng `Run As → Spring Boot App`.
3. Mở `http://localhost:8080`.

Hoặc dùng terminal (cách này ổn định cả khi đường dẫn Windows có dấu tiếng Việt):

```bash
mvn clean package
java -jar target/novagear-store-1.0.0.jar
```

Tài khoản demo:

- Khách hàng: `user` / `user123`
- Quản trị: `admin` / `admin123`

H2 lưu dữ liệu tại thư mục `data/`. API cung cấp CRUD sản phẩm, đơn hàng, tư vấn và tài khoản; frontend nằm trong `src/main/resources/static` nên Spring Boot phục vụ trực tiếp.

