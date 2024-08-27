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

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
public class ChatMessageController {

	private static final Logger logger = LogManager.getLogger(ChatMessageController.class);

	@Autowired
	private ChatMessageService chatMessageService;

	@Autowired
	private SimpMessagingTemplate messagingTemplate;

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

	@PostMapping("/ack")
	public ResponseEntity<Void> acknowledgeMessage(@RequestBody Map<String, Object> ackData) {
		String messageId = ackData.get("messageId").toString();

		// ACK 수신 로그 남기기
		logger.info("ACK received for message ID: " + messageId);

		// ACK 처리 로직 추가 (예: 메시지 상태 업데이트 등)

		return ResponseEntity.ok().build();
	}

}
