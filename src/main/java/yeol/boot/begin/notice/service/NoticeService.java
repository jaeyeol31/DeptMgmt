package yeol.boot.begin.notice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import yeol.boot.begin.notice.entity.Notice;
import yeol.boot.begin.notice.repository.NoticeRepository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@Service
public class NoticeService {

	@Autowired
	private NoticeRepository noticeRepository;

	private final Path thumbnailLocation = Paths.get("src/main/resources/static/uploads/thumbnails");
	private final Path attachmentLocation = Paths.get("src/main/resources/static/uploads/attachments");
	private final Path contentImageLocation = Paths.get("src/main/resources/static/uploads/content-images");

	public Notice saveNotice(Notice notice, MultipartFile thumbnail, MultipartFile attachment) throws IOException {
		notice.setNoticeNumber(generateNoticeNumber()); // 공지사항 번호 생성

		Notice savedNotice = noticeRepository.save(notice);

		if (thumbnail != null && !thumbnail.isEmpty()) {
			String thumbnailPath = saveFile(thumbnail, thumbnailLocation, savedNotice.getId() + "_thumbnail");
			savedNotice.setThumbnail(thumbnailPath);
		}

		if (attachment != null && !attachment.isEmpty()) {
			String attachmentPath = saveFile(attachment, attachmentLocation, savedNotice.getId() + "_attachment");
			savedNotice.setAttachment(attachmentPath);
		}

		return noticeRepository.save(savedNotice);
	}

	private Long generateNoticeNumber() {
		Long maxNoticeNumber = noticeRepository.findMaxNoticeNumber();
		return maxNoticeNumber != null ? maxNoticeNumber + 1 : 1L;
	}

	private String saveFile(MultipartFile file, Path location, String fileName) throws IOException {
		Files.createDirectories(location);
		String extension = getFileExtension(file.getOriginalFilename());
		Path destinationFile = location.resolve(fileName + extension).normalize().toAbsolutePath();
		file.transferTo(destinationFile);
		return "/uploads/" + location.getFileName() + "/" + destinationFile.getFileName().toString();
	}

	private String getFileExtension(String fileName) {
		return fileName.contains(".") ? fileName.substring(fileName.lastIndexOf(".")) : "";
	}

	public Notice updateNotice(Long id, Notice noticeDetails, MultipartFile thumbnail, MultipartFile attachment)
	        throws IOException {
	    Notice notice = noticeRepository.findById(id).orElseThrow(() -> new RuntimeException("Notice not found"));

	    notice.setTitle(noticeDetails.getTitle());
	    notice.setContent(noticeDetails.getContent());
	
	    notice.setCategory(noticeDetails.getCategory());
	    notice.setSubcategory(noticeDetails.getSubcategory());

	    if (thumbnail != null && !thumbnail.isEmpty()) {
	        String thumbnailPath = saveFile(thumbnail, thumbnailLocation, notice.getId() + "_thumbnail");
	        notice.setThumbnail(thumbnailPath);
	    }

	    if (attachment != null && !attachment.isEmpty()) {
	        String attachmentPath = saveFile(attachment, attachmentLocation, notice.getId() + "_attachment");
	        notice.setAttachment(attachmentPath);
	    }

	    return noticeRepository.save(notice);
	}

	public Notice getNoticeById(Long id) {
		Notice notice = noticeRepository.findById(id).orElseThrow(() -> new RuntimeException("Notice not found"));

		// 조회수 증가
		notice.setViews(notice.getViews() + 1);
		noticeRepository.save(notice);

		return notice;
	}

	public List<Notice> getAllNotices() {
		return noticeRepository.findAll();
	}

	public void deleteNotice(Long id) {
		noticeRepository.deleteById(id);
	}

	public Page<Notice> getNoticesWithPagination(int page, int size) {
		Pageable pageable = PageRequest.of(page, size);
		return noticeRepository.findAllByOrderByCreatedAtDesc(pageable);
	}

	public Notice getPreviousNotice(Long id) {
		return noticeRepository.findTopByIdLessThanOrderByIdDesc(id);
	}

	public Notice getNextNotice(Long id) {
		return noticeRepository.findTopByIdGreaterThanOrderByIdAsc(id);
	}

	public List<Notice> getRecentNotices() {
		return noticeRepository.findTop5ByOrderByCreatedAtDesc();
	}
}
