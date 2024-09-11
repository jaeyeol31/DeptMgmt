package yeol.boot.begin.notification.service;

import java.util.List;

import javax.management.RuntimeErrorException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import yeol.boot.begin.emp.entity.Employee;
import yeol.boot.begin.emp.service.EmployeeService;
import yeol.boot.begin.notification.entity.Notification;
import yeol.boot.begin.notification.repository.NotificationRepository;

@Service
@RequiredArgsConstructor
public class NotificationService {

	@Autowired
	private final NotificationRepository notificationRepository;

	@Autowired
	private final EmployeeService employeeService;

	// 알림 전체 조회
	public Notification createNotification(Long empno, String content, String type, String tagetUrl) {
		Employee employee = employeeService.getEmployeeByEmpno(empno)
				.orElseThrow(() -> new RuntimeException("Employee not found!"));
		Notification notification = new Notification();
		notification.setEmployee(employee);
		notification.setContent(content);
		notification.setNotificationType(type);
		notification.setTargetUrl(tagetUrl);
		return notificationRepository.save(notification);
	}

	// 알림 상세 조회
	public List<Notification> getNotificationsByEmpno(Long empno) {
		return notificationRepository.findByEmployee_Empno(empno);
	}

	// 알림 읽음 처리
	public Notification markAsRead(Long notificationId) {
		Notification notification = notificationRepository.findById(notificationId)
				.orElseThrow(() -> new RuntimeErrorException(null, "Notification not foun"));
		notification.setRead(true);
		return notificationRepository.save(notification);
	}

	// 알림 삭제
	public void deleteNotification(Long notificationId) {
		notificationRepository.deleteById(notificationId);
	}
}
