package yeol.boot.begin.notice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import yeol.boot.begin.notice.entity.Notice;
import yeol.boot.begin.notice.service.NoticeService;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/notices")
public class NoticeController {

    @Autowired
    private NoticeService noticeService;

    private final Path rootLocation = Paths.get("src/main/resources/static/uploads");

    @PostMapping("/upload")
    public ResponseEntity<Notice> createNotice(
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam("category") Notice.Category category,
            @RequestParam("subcategory") String subcategory,
            @RequestParam(value = "thumbnail", required = false) MultipartFile thumbnail,
            @RequestParam(value = "attachment", required = false) MultipartFile attachment) throws IOException {

        Notice notice = new Notice();
        notice.setTitle(title);
        notice.setContent(content);
        notice.setCategory(category); // 카테고리 설정
        notice.setSubcategory(subcategory); // 서브카테고리 설정

        Notice savedNotice = noticeService.saveNotice(notice, thumbnail, attachment);
        return ResponseEntity.ok(savedNotice);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Notice> updateNotice(
            @PathVariable("id") Long id,
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam("category") Notice.Category category,
            @RequestParam("subcategory") String subcategory,
            @RequestParam(value = "thumbnail", required = false) MultipartFile thumbnail,
            @RequestParam(value = "attachment", required = false) MultipartFile attachment) throws IOException {

        Notice noticeDetails = new Notice();
        noticeDetails.setTitle(title);
        noticeDetails.setContent(content);
        noticeDetails.setCategory(category); // 카테고리 설정
        noticeDetails.setSubcategory(subcategory); // 서브카테고리 설정

        Notice updatedNotice = noticeService.updateNotice(id, noticeDetails, thumbnail, attachment);
        return ResponseEntity.ok(updatedNotice);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Notice> getNoticeById(@PathVariable("id") Long id) {
        Notice notice = noticeService.getNoticeById(id);
        return ResponseEntity.ok(notice);
    }

    @GetMapping("/download/{directory}/{filename}")
    public ResponseEntity<byte[]> downloadFile(@PathVariable("directory") String directory,
                                               @PathVariable("filename") String filename) throws IOException {
        Path file = rootLocation.resolve(directory).resolve(filename);
        return ResponseEntity.ok().body(Files.readAllBytes(file));
    }

    @GetMapping
    public List<Notice> getAllNotices() {
        return noticeService.getAllNotices();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotice(@PathVariable("id") Long id) {
        noticeService.deleteNotice(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/paged")
    public ResponseEntity<Page<Notice>> getNoticesWithPagination(@RequestParam("page") int page,
                                                                 @RequestParam("size") int size) {
        Page<Notice> notices = noticeService.getNoticesWithPagination(page, size);
        return ResponseEntity.ok(notices);
    }

    @GetMapping("/{id}/previous")
    public ResponseEntity<Notice> getPreviousNotice(@PathVariable("id") Long id) {
        Notice previousNotice = noticeService.getPreviousNotice(id);
        return ResponseEntity.ok(previousNotice);
    }

    @GetMapping("/{id}/next")
    public ResponseEntity<Notice> getNextNotice(@PathVariable("id") Long id) {
        Notice nextNotice = noticeService.getNextNotice(id);
        return ResponseEntity.ok(nextNotice);
    }

    @GetMapping("/recent")
    public ResponseEntity<List<Notice>> getRecentNotices() {
        List<Notice> recentNotices = noticeService.getRecentNotices();
        return ResponseEntity.ok(recentNotices);
    }
}
