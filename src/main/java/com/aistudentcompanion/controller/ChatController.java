package com.aistudentcompanion.controller;

import com.aistudentcompanion.model.ChatMessage;
import com.aistudentcompanion.service.OllamaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Controller
public class ChatController {

    @Autowired
    private OllamaService ollamaService;
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload ChatMessage chatMessage) {
        // Set timestamp
        chatMessage.setTimestamp(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_TIME));
        
        // Send user message to all subscribers
        messagingTemplate.convertAndSend("/topic/public", chatMessage);
        
        // If it's a user message (not a system message), generate AI response
        if (chatMessage.getType() == ChatMessage.MessageType.CHAT) {
            generateAIResponse(chatMessage);
        }
    }

    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public ChatMessage addUser(@Payload ChatMessage chatMessage) {
        chatMessage.setType(ChatMessage.MessageType.JOIN);
        chatMessage.setContent(chatMessage.getSender() + " joined the chat!");
        chatMessage.setTimestamp(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_TIME));
        return chatMessage;
    }
    
    private void generateAIResponse(ChatMessage userMessage) {
        String prompt = userMessage.getContent();
        
        ollamaService.generateResponse(prompt).subscribe(response -> {
            ChatMessage aiMessage = new ChatMessage();
            aiMessage.setType(ChatMessage.MessageType.CHAT);
            aiMessage.setSender("AI Assistant");
            aiMessage.setContent(response);
            aiMessage.setTimestamp(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_TIME));
            
            messagingTemplate.convertAndSend("/topic/public", aiMessage);
        });
    }
}
