package com.aistudentcompanion.controller;

import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ApiController {

    @GetMapping("/status")
    public Map<String, String> getStatus() {
        Map<String, String> status = new HashMap<>();
        status.put("status", "AI Student Companion API is running");
        status.put("version", "1.0.0");
        return status;
    }

    // Add more API endpoints as needed
}
