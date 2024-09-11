package yeol.boot.begin.notification.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import yeol.boot.begin.notification.entity.Notification;
import yeol.boot.begin.notification.service.NotificationService;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {
    @Autowired
    private final NotificationService notificationService;

    // 특정 사원 알림 전체 조회
    @GetMapping("/employee/{empno}")
    public List<Notification> getNotificationByEmpno(@PathVariable("empno") Long empno) {
        return notificationService.getNotificationsByEmpno(empno);
    }

    // 특정 사원 알림 상세조회 및 읽음 표시
    @GetMapping("/{notificationId}")
    public Notification getNotification(@PathVariable("notificationId") Long notificationId) {
        return notificationService.markAsRead(notificationId);
    }

    // 알림 삭제
    @PostMapping("/delete/{notificationId}/{empno}")
    public void deleteNotification(@PathVariable("notificationId") Long notificationId, @PathVariable("empno") Long empno) {
        notificationService.deleteNotification(notificationId);
    }
}

