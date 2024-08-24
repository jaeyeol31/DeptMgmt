package yeol.boot.begin.chat.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import yeol.boot.begin.chat.entity.ChatRoom;
import yeol.boot.begin.chat.service.ChatRoomService;
import yeol.boot.begin.emp.entity.Employee;
import yeol.boot.begin.emp.service.EmployeeService;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/chat")
public class ChatRoomController {

    private final ChatRoomService chatRoomService;
    private final EmployeeService employeeService;

    @Autowired
    public ChatRoomController(ChatRoomService chatRoomService, EmployeeService employeeService) {
        this.chatRoomService = chatRoomService;
        this.employeeService = employeeService;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createChatRoom(@RequestParam("participants") String participants,
                                            @RequestParam("empnoSelf") String empnoSelf) {
        if (participants.contains(empnoSelf)) {
            return ResponseEntity.badRequest().body("본인과는 채팅할 수 없습니다.");
        }
        
        participants = empnoSelf + "," + participants;
        String[] empnoArray = participants.split(",");
        List<String> participantNames = new ArrayList<>();

        for (String empno : empnoArray) {
            Optional<Employee> employee = employeeService.getEmployeeByEmpno(Long.parseLong(empno));
            employee.ifPresent(emp -> participantNames.add(emp.getEname()));
        }

        String roomName = String.join(", ", participantNames) + "의 대화방";
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
