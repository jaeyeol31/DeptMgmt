package yeol.boot.begin.chat.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "chat_room")
@Data
public class ChatRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "room_name")
    private String roomName;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "participants")
    private String participants; // 참가자 이름을 쉼표로 구분하여 저장

    public ChatRoom() {
    }

    public ChatRoom(String roomName, String participants) {
        this.roomName = roomName;
        this.participants = participants;
    }
}
