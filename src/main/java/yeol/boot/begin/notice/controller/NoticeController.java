package yeol.boot.begin.notice.controller;

import org.springframework.beans.factory.annotation.Autowired;
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
            @RequestParam(value = "thumbnail", required = false) MultipartFile thumbnail,
            @RequestParam(value = "attachment", required = false) MultipartFile attachment) throws IOException {

        Notice notice = new Notice();
        notice.setTitle(title);
        notice.setContent(content);

        Notice savedNotice = noticeService.saveNotice(notice, thumbnail, attachment);
        return ResponseEntity.ok(savedNotice);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Notice> updateNotice(
            @PathVariable("id") Long id,
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam(value = "thumbnail", required = false) MultipartFile thumbnail,
            @RequestParam(value = "attachment", required = false) MultipartFile attachment) throws IOException {

        Notice noticeDetails = new Notice();
        noticeDetails.setTitle(title);
        noticeDetails.setContent(content);

        Notice updatedNotice = noticeService.updateNotice(id, noticeDetails, thumbnail, attachment);
        return ResponseEntity.ok(updatedNotice);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Notice> getNoticeById(@PathVariable("id") Long id) {
        Notice notice = noticeService.getNoticeById(id);
        return ResponseEntity.ok(notice);
    }

    @GetMapping("/download/{directory}/{filename}")
    public ResponseEntity<byte[]> downloadFile(
            @PathVariable("directory") String directory,
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
}
