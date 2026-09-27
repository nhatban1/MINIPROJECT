package vn.novagear.store.service;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import vn.novagear.store.model.Product;

import java.math.BigDecimal;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class AssistantService {
    private static final Pattern BUDGET = Pattern.compile("(\\d+(?:[.,]\\d+)?)\\s*(triệu|tr|m)\\b", Pattern.CASE_INSENSITIVE);

    private final ProductService products;
    private final RestClient.Builder restClientBuilder;

    @Value("${novagear.ai.chat-completions-url:}")
    private String chatCompletionsUrl;

    @Value("${novagear.ai.api-key:}")
    private String apiKey;

    @Value("${novagear.ai.model:gpt-4o-mini}")
    private String model;

    public AssistantService(ProductService products, RestClient.Builder restClientBuilder) {
        this.products = products;
        this.restClientBuilder = restClientBuilder;
    }

    public ChatReply reply(String message) {
        List<Product> catalog = products.publicList();
        if (!chatCompletionsUrl.isBlank() && !apiKey.isBlank()) {
            try {
                String answer = askModel(message, catalog);
                if (answer != null && !answer.isBlank()) return new ChatReply(answer, "model");
            } catch (RestClientException ignored) {
                // Use the available store catalog if the configured model is offline.
            }
        }
        return new ChatReply(catalogAdvice(message, catalog), "catalog");
    }

    private String askModel(String message, List<Product> catalog) {
        String inventory = catalog.stream()
                .map(product -> String.format("%s | %s | %s | còn %d", product.getName(), product.getCategory(),
                        product.getPrice().toPlainString(), product.getStock()))
                .reduce((first, second) -> first + "\n" + second)
                .orElse("Chưa có sản phẩm.");
        String instruction = "Bạn là trợ lý tư vấn của NovaGear, trả lời bằng tiếng Việt, ngắn gọn và chỉ tư vấn sản phẩm trong catalog. "
                + "Không tự bịa giá hoặc tồn kho; ngân sách tính bằng VND.\nCATALOG:\n" + inventory;
        Map<String, Object> request = Map.of(
                "model", model,
                "temperature", 0.35,
                "messages", List.of(
                        Map.of("role", "system", "content", instruction),
                        Map.of("role", "user", "content", message)));
        JsonNode response = restClientBuilder.build()
            .post().uri(chatCompletionsUrl)
                .header("Authorization", "Bearer " + apiKey)
                .body(request)
                .retrieve().body(JsonNode.class);
        return response == null ? "" : response.at("/choices/0/message/content").asText("");
    }

    private String catalogAdvice(String message, List<Product> catalog) {
        String normalized = message.toLowerCase(Locale.ROOT);
        BigDecimal budget = parseBudget(normalized);
        List<Product> suggestions = catalog.stream()
                .filter(product -> product.getStock() > 0)
                .filter(product -> budget == null || product.getPrice().compareTo(budget) <= 0)
                .sorted((first, second) -> {
                    int firstScore = score(first, normalized);
                    int secondScore = score(second, normalized);
                    int byRelevance = Integer.compare(secondScore, firstScore);
                    return byRelevance != 0 ? byRelevance : first.getPrice().compareTo(second.getPrice());
                })
                .limit(3)
                .toList();
        if (suggestions.isEmpty()) {
            return "Mình chưa tìm được sản phẩm còn hàng trong mức ngân sách đó. Bạn thử tăng ngân sách hoặc cho biết bạn đang tìm CPU, VGA, RAM hay thiết bị ngoại vi nhé.";
        }
        String picks = suggestions.stream()
                .map(product -> String.format("• %s — %s (%s, còn %d)", product.getName(),
                        product.getPrice().toPlainString(), product.getCategory(), product.getStock()))
                .reduce((first, second) -> first + "\n" + second)
                .orElse("");
        String budgetNote = budget == null ? "" : " trong mức giá mỗi món đến " + budget.toPlainString() + "đ";
        return "Gợi ý từ catalog NovaGear" + budgetNote + ":\n" + picks
                + "\n\nĐây là gợi ý linh kiện riêng lẻ, chưa phải tổng giá một bộ PC. Cho mình biết mục đích sử dụng để lọc sát hơn nhé.";
    }

    private int score(Product product, String message) {
        String category = product.getCategory().toLowerCase(Locale.ROOT);
        int score = product.isFeatured() ? 1 : 0;
        if ((message.contains("game") || message.contains("gaming") || message.contains("đồ họa"))
                && (category.equals("vga") || category.equals("cpu"))) score += 5;
        if ((message.contains("học") || message.contains("văn phòng") || message.contains("office"))
                && (category.equals("cpu") || category.equals("ram") || category.equals("ssd"))) score += 5;
        if ((message.contains("màn hình") || message.contains("monitor")) && category.equals("màn hình")) score += 8;
        if ((message.contains("phím") || message.contains("keyboard")) && category.equals("bàn phím")) score += 8;
        if (message.contains(category)) score += 4;
        return score;
    }

    private BigDecimal parseBudget(String message) {
        Matcher matcher = BUDGET.matcher(message);
        if (!matcher.find()) return null;
        String amount = matcher.group(1).replace(',', '.');
        return new BigDecimal(amount).multiply(BigDecimal.valueOf(1_000_000));
    }

    public record ChatReply(String reply, String mode) {}
}
