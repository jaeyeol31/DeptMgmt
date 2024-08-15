package yeol.boot.begin.notice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import yeol.boot.begin.notice.entity.Notice;

public interface NoticeRepository extends JpaRepository<Notice, Long> {
}
