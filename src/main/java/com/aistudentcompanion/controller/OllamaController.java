package com.aistudentcompanion.controller;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/ollama")
public class OllamaController {
    
    private static final String OLLAMA_URL = "http://localhost:11434/api/generate";
    private static final String MODEL = "llama3.2:1b";
    
    private final RestTemplate restTemplate;
    
    public OllamaController() {
        this.restTemplate = new RestTemplate();
    }
    
    @PostMapping("/generate")
    public ResponseEntity<String> generateResponse(@RequestBody String prompt) {
        try {
            // Prepare the request to Ollama API
            String requestBody = String.format(
                "{\"model\": \"%s\", \"prompt\": \"%s\"}",
                MODEL,
                prompt.replace("\"", "\\\"")
            );
            
            // Set headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            // Create HTTP entity
            HttpEntity<String> request = new HttpEntity<>(requestBody, headers);
            
            // Send request to Ollama
            ResponseEntity<String> response = restTemplate.postForEntity(
                OLLAMA_URL, 
                request, 
                String.class
            );
            
            return ResponseEntity.ok(response.getBody());
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error generating response: " + e.getMessage());
        }
    }
}
