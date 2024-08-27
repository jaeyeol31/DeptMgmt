package yeol.boot.begin.chat.service;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import yeol.boot.begin.chat.entity.ChatMessage;
import yeol.boot.begin.chat.repository.ChatMessageRepository;

import java.util.List;

@Service
public class ChatMessageService {

    private static final Logger logger = LogManager.getLogger(ChatMessageService.class);

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    public ChatMessage saveMessage(ChatMessage message) {
        logger.debug("Attempting to save message: " + message);
        ChatMessage savedMessage = chatMessageRepository.save(message);
        logger.debug("Message successfully saved: " + savedMessage);
        return savedMessage;
    }

    public List<ChatMessage> getMessagesByRoomId(Long roomId) {
        logger.debug("Fetching messages for room ID: " + roomId);
        List<ChatMessage> messages = chatMessageRepository.findByRoomId(roomId);
        logger.debug("Fetched messages: " + messages);
        return messages;
    }
}
