package yeol.boot.begin.chat.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import yeol.boot.begin.chat.entity.ChatRoom;
import yeol.boot.begin.chat.service.ChatRoomService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/chat")
public class ChatRoomController {

    private final ChatRoomService chatRoomService;

    @Autowired
    public ChatRoomController(ChatRoomService chatRoomService) {
        this.chatRoomService = chatRoomService;
    }

    @PostMapping("/create")
    public ResponseEntity<ChatRoom> createChatRoom(@RequestParam(name = "roomName") String roomName, 
                                                   @RequestParam(name = "participants") String participants) {
        ChatRoom chatRoom = chatRoomService.createChatRoom(roomName, participants);
        return ResponseEntity.ok(chatRoom);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteChatRoom(@PathVariable(name = "id") Long id) {
        chatRoomService.deleteChatRoom(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/rooms")
    public ResponseEntity<List<ChatRoom>> getAllChatRooms() {
        List<ChatRoom> chatRooms = chatRoomService.getAllChatRooms();
        return ResponseEntity.ok(chatRooms);
    }

    @GetMapping("/room/{id}")
    public ResponseEntity<ChatRoom> getChatRoomById(@PathVariable(name = "id") Long id) {
        Optional<ChatRoom> chatRoom = chatRoomService.getChatRoomById(id);
        return chatRoom.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/rooms/participant")
    public ResponseEntity<List<ChatRoom>> getChatRoomsByParticipant(@RequestParam(name = "participant") String participant) {
        List<ChatRoom> chatRooms = chatRoomService.getChatRoomsByParticipant(participant);
        return ResponseEntity.ok(chatRooms);
    }
}
