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

    @Enumerated(EnumType.STRING)
    private Category category; // 공지사항 카테고리

    private String subcategory; // 공지사항 서브카테고리

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

    public enum Category {
        HR, IT_SECURITY, PROJECT_WORK, COMPANY_NEWS, URGENT
    }
}