package yeol.boot.begin.chat.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import yeol.boot.begin.chat.entity.ChatMessage;
import yeol.boot.begin.chat.repository.ChatMessageRepository;

import java.util.List;

@Service
public class ChatMessageService {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    public ChatMessage saveMessage(ChatMessage message) {
        // Log the message before saving to database
        System.out.println("Saving message to database: " + message);
        
        return chatMessageRepository.save(message);
    }

    public List<ChatMessage> getMessagesByRoomId(Long roomId) {
        // Log the room ID before fetching messages
        System.out.println("Fetching messages from database for room ID: " + roomId);
        
        return chatMessageRepository.findByRoomId(roomId);
    }
}
