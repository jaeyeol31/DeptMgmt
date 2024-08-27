package yeol.boot.begin.chat.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import yeol.boot.begin.chat.entity.ChatRoom;
import yeol.boot.begin.chat.repository.ChatRoomRepository;

import java.util.List;
import java.util.Optional;

@Service
public class ChatRoomService {

    @Autowired
    private ChatRoomRepository chatRoomRepository;

    public ChatRoom createChatRoom(String roomName, String participants) {
        ChatRoom chatRoom = new ChatRoom(roomName, participants);
        return chatRoomRepository.save(chatRoom);
    }

    public void deleteChatRoom(Long id) {
        chatRoomRepository.deleteById(id);
    }

    public List<ChatRoom> getAllChatRooms() {
        return chatRoomRepository.findAll();
    }

    public Optional<ChatRoom> getChatRoomById(Long id) {
        return chatRoomRepository.findById(id);
    }

    public List<ChatRoom> getChatRoomsByParticipant(String participant) {
        return chatRoomRepository.findByParticipantsContaining(participant);
    }
}
