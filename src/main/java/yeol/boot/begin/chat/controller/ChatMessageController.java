package yeol.boot.begin.chat.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import yeol.boot.begin.chat.entity.ChatMessage;
import yeol.boot.begin.chat.service.ChatMessageService;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class ChatMessageController {

    @Autowired
    private ChatMessageService chatMessageService;

    @PostMapping("/send")
    public ResponseEntity<ChatMessage> sendMessage(@RequestBody ChatMessage message) {
        // Log received message before saving
        System.out.println("Received message to save: " + message);
        
        ChatMessage savedMessage = chatMessageService.saveMessage(message);
        
        // Log the saved message details
        System.out.println("Message saved: " + savedMessage);
        
        return ResponseEntity.ok(savedMessage);
    }

    @GetMapping("/room/{roomId}")
    public ResponseEntity<List<ChatMessage>> getMessagesByRoom(@PathVariable("roomId") Long roomId) {
        // Log room ID for which messages are being fetched
        System.out.println("Fetching messages for room ID: " + roomId);
        
        List<ChatMessage> messages = chatMessageService.getMessagesByRoomId(roomId);
        
        // Log fetched messages
        System.out.println("Messages fetched: " + messages);
        
        return ResponseEntity.ok(messages);
    }

}
