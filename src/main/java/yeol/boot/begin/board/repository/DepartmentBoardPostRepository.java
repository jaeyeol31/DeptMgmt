package yeol.boot.begin.board.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import yeol.boot.begin.board.entity.DepartmentBoardPost;

import java.util.List;

public interface DepartmentBoardPostRepository extends JpaRepository<DepartmentBoardPost, Long> {
    List<DepartmentBoardPost> findByDeptNo(Integer deptNo);
}
