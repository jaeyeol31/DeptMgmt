package yeol.boot.begin.chat.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import yeol.boot.begin.chat.entity.ChatRoom;

import java.util.List;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    List<ChatRoom> findByParticipantsContaining(String participant);
}
