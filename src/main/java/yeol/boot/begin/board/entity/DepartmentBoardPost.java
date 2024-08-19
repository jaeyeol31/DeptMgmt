package yeol.boot.begin.board.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "department_board_post")
@Data
public class DepartmentBoardPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String content;
    private String author;  // 작성자 이름

    @Column(name = "empno")
    private Long empNo;  // 작성자 사원번호

    @Column(name = "deptno")
    private Integer deptNo;  // 부서 번호

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
