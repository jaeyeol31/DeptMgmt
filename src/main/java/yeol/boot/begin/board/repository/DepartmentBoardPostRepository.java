package yeol.boot.begin.board.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import yeol.boot.begin.board.entity.DepartmentBoardPost;

import java.util.List;

public interface DepartmentBoardPostRepository extends JpaRepository<DepartmentBoardPost, Long> {

    List<DepartmentBoardPost> findByDeptNo(Integer deptNo);

    @Query("SELECT p FROM DepartmentBoardPost p WHERE p.deptNo = :deptNo ORDER BY p.createdAt DESC")
    List<DepartmentBoardPost> findTopByDeptNoOrderByCreatedAtDesc(@Param("deptNo") Integer deptNo, Pageable pageable);
}
