package yeol.boot.begin.chat.controller;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import yeol.boot.begin.chat.entity.ChatMessage;
import yeol.boot.begin.chat.service.ChatMessageService;
import yeol.boot.begin.emp.entity.Employee;
import yeol.boot.begin.emp.service.EmployeeService;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/messages")
public class ChatMessageController {

    private static final Logger logger = LogManager.getLogger(ChatMessageController.class);

    @Autowired
    private ChatMessageService chatMessageService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private EmployeeService employeeService;

    @PostMapping("/send")
    public ResponseEntity<ChatMessage> sendMessage(@RequestBody ChatMessage message) {
        logger.info("Received message to save: " + message);

        ChatMessage savedMessage = chatMessageService.saveMessage(message);

        logger.info("Message saved: " + savedMessage);

        String destination = "/topic/chatroom/" + message.getRoomId();
        logger.info("Sending message to chat room: " + destination + " with content: " + savedMessage.getContent());

        messagingTemplate.convertAndSend(destination, savedMessage);

        return ResponseEntity.ok(savedMessage);
    }

    @GetMapping("/room/{roomId}")
    public ResponseEntity<List<ChatMessage>> getMessagesByRoom(@PathVariable("roomId") Long roomId) {
        logger.info("Fetching messages for room ID: " + roomId);

        List<ChatMessage> messages = chatMessageService.getMessagesByRoomId(roomId);

        logger.info("Messages fetched: " + messages);

        return ResponseEntity.ok(messages);
    }

    @MessageMapping("/message")
    @SendTo("/topic/chatroom/{roomId}")
    public ChatMessage handleMessage(ChatMessage message) {
        logger.info("Message received from client: " + message);
        return message;
    }

//    @PostMapping("/ack")
//    public ResponseEntity<Void> acknowledgeMessage(@RequestBody Map<String, Object> ackData) {
//        String messageId = ackData.get("messageId").toString();
//
//        logger.info("ACK received for message ID: " + messageId);
//
//        return ResponseEntity.ok().build();
//    }

    @GetMapping("/employee/{empno}")
    public ResponseEntity<Employee> getEmployeeByEmpno(@PathVariable("empno") Long empno) {
        Optional<Employee> employeeOpt = employeeService.getEmployeeByEmpno(empno);
        return employeeOpt.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.status(404).build());
    }
}
