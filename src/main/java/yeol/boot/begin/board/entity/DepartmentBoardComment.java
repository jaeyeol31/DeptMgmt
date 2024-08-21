package yeol.boot.begin.board.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "department_board_comment")
@Data
public class DepartmentBoardComment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String content;  // 댓글 내용

    @Column(name = "author")
    private String author;  // 댓글 작성자 이름

    @Column(name = "empno")
    private Long empNo;  // 댓글 작성자 사원번호

    @Column(name = "deptno")
    private Integer deptNo;  // 댓글 작성자 부서 번호

    @ManyToOne
    @JoinColumn(name = "post_id")
    private DepartmentBoardPost post;  // 댓글이 달린 게시물

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
