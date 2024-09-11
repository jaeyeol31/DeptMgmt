package yeol.boot.begin.notification.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import yeol.boot.begin.emp.entity.Employee;

@Entity
@Table(name = "notification")
@Data
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "empno", referencedColumnName = "empno")
    private Employee employee;

    @Column(name = "content")
    private String content;

    @Column(name = "notification_type")
    private String notificationType; // 알림 유형 (e.g., 채팅, 댓글)

    @Column(name = "is_read")
    private boolean isRead = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "target_url")
    private String targetUrl; // 클릭 시 이동할 URL (e.g., 채팅방 URL)
}
