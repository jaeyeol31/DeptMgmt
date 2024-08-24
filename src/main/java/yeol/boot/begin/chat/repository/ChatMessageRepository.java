package yeol.boot.begin.chat.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import yeol.boot.begin.chat.entity.ChatMessage;
import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByRoomId(Long roomId);
}
