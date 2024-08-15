package yeol.boot.begin.notice.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "notice")
@Data
public class Notice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long noticeNumber;  // 공지사항 번호

    private String title;

    @Lob
    private String content;

    private String thumbnail;  // 썸네일 이미지 경로

    private String attachment; // 파일 경로

    private int views;  // 조회수

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        views = 0;  // 조회수 초기화
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
