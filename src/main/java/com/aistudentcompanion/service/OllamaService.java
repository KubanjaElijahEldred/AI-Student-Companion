package com.aistudentcompanion.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class OllamaService {
    
    private final WebClient webClient;
    
    public OllamaService(@Value("${ollama.url:http://localhost:11434}") String ollamaUrl) {
        this.webClient = WebClient.builder()
                .baseUrl(ollamaUrl)
                .build();
    }
    
    public Mono<String> generateResponse(String prompt) {
        OllamaRequest request = new OllamaRequest("llama3.2:1b", prompt, false, 0.7);
        
        return webClient.post()
                .uri("/api/generate")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(OllamaResponse.class)
                .map(OllamaResponse::getResponse);
    }
    
    private static class OllamaRequest {
        private final String model;
        private final String prompt;
        private final boolean stream;
        private final double temperature;
        
        public OllamaRequest(String model, String prompt, boolean stream, double temperature) {
            this.model = model;
            this.prompt = prompt;
            this.stream = stream;
            this.temperature = temperature;
        }
        
        // Getters
        public String getModel() { return model; }
        public String getPrompt() { return prompt; }
        public boolean isStream() { return stream; }
        public double getTemperature() { return temperature; }
    }
    
    private static class OllamaResponse {
        private String response;
        
        // Getters and Setters
        public String getResponse() { return response; }
        public void setResponse(String response) { this.response = response; }
    }
}
