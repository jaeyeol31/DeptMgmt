package yeol.boot.begin.chat.service;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import yeol.boot.begin.chat.entity.ChatMessage;
import yeol.boot.begin.chat.entity.ChatRoom;
import yeol.boot.begin.chat.repository.ChatMessageRepository;
import yeol.boot.begin.notification.repository.NotificationRepository;
import yeol.boot.begin.notification.service.NotificationService;

import java.util.List;
import java.util.Optional;

@Service
public class ChatMessageService {

	private static final Logger logger = LogManager.getLogger(ChatMessageService.class);

	@Autowired
	private ChatMessageRepository chatMessageRepository;
	
	@Autowired
	private NotificationService notificationService;
	
	@Autowired
    private ChatRoomService chatRoomService;

    public ChatMessage saveMessage(ChatMessage message) {
        logger.debug("Attempting to save message: " + message);
        ChatMessage savedMessage = chatMessageRepository.save(message);
        logger.debug("Message successfully saved: " + savedMessage);

        // 새로운 메시지에 대한 알림 생성
        String content = "새로운 메시지가 도착했습니다: " + message.getContent();
        String targetUrl = "/chat/room/" + message.getRoomId(); // 클릭 시 이동할 채팅방 URL

        // 채팅방 참여자 중 발신자를 제외한 사용자들에게 알림 전송
        Optional<ChatRoom> chatRoomOpt = chatRoomService.getChatRoomById(message.getRoomId());
        if (chatRoomOpt.isPresent()) {
            ChatRoom chatRoom = chatRoomOpt.get();
            String[] participants = chatRoom.getParticipants().split(","); // 쉼표로 구분된 참여자 목록

            for (String participant : participants) {
                Long participantId = Long.parseLong(participant.trim());

                // 발신자와 같지 않은 사용자들에게만 알림 전송
                if (!participantId.equals(message.getSenderId())) {
                    notificationService.createNotification(participantId, content, "chat message", targetUrl);
                }
            }
        }

        return savedMessage;
    }

//	public ChatMessage saveMessage(ChatMessage message) {
//		logger.debug("Attempting to save message: " + message);
//		ChatMessage savedMessage = chatMessageRepository.save(message);
//		logger.debug("Message successfully saved: " + savedMessage);
//		// 새로운 메시지에 대한 알림 생성
//		String content = "새로운 메시지가 도착했습니다: " + message.getContent();
//		String targetUrl = "/chat/room/" + message.getRoomId(); // 클릭 시 이동할 채팅방 URL
//		notificationService.createNotification(message.getSenderId(), content, targetUrl, "chat message");
//
//		return savedMessage;
//	}

	public List<ChatMessage> getMessagesByRoomId(Long roomId) {
		logger.debug("Fetching messages for room ID: " + roomId);
		List<ChatMessage> messages = chatMessageRepository.findByRoomId(roomId);
		logger.debug("Fetched messages: " + messages);
		return messages;
	}
}
