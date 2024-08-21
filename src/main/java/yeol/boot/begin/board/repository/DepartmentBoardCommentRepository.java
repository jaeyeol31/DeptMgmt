package yeol.boot.begin.board.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import yeol.boot.begin.board.entity.DepartmentBoardComment;

import java.util.List;

public interface DepartmentBoardCommentRepository extends JpaRepository<DepartmentBoardComment, Long> {
    List<DepartmentBoardComment> findByPostId(Long postId);
}
