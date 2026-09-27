package vn.novagear.store.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.novagear.store.service.AssistantService;
import vn.novagear.store.service.AssistantService.ChatReply;

@RestController
@RequestMapping("/api/assistant")
public class AssistantController {
    private final AssistantService assistant;

    public AssistantController(AssistantService assistant) {
        this.assistant = assistant;
    }

    @PostMapping("/chat")
    public ChatReply chat(@Valid @RequestBody ChatRequest request) {
        return assistant.reply(request.message());
    }

    public record ChatRequest(@NotBlank @Size(max = 500) String message) {}
}
