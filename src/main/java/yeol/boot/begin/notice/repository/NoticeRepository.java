package yeol.boot.begin.notice.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import yeol.boot.begin.notice.entity.Notice;

public interface NoticeRepository extends JpaRepository<Notice, Long> {

    @Query("SELECT MAX(n.noticeNumber) FROM Notice n")
    Long findMaxNoticeNumber();
    
    Page<Notice> findAllByOrderByCreatedAtDesc(Pageable pageable);

    // 이전글을 찾기 위한 쿼리 메서드
    Notice findTopByIdLessThanOrderByIdDesc(Long id);

    // 다음글을 찾기 위한 쿼리 메서드
    Notice findTopByIdGreaterThanOrderByIdAsc(Long id);
}
