import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';  // 추가

const NotificationModal = ({ show, onClose, empno }) => {
	const [notifications, setNotifications] = useState([]);
	const navigate = useNavigate();  // 추가

	useEffect(() => {
		if (empno && show) {
			axios.get(`/api/notifications/employee/${empno}`)
				.then(response => setNotifications(response.data))
				.catch(error => console.error('Error fetching notifications:', error));
		}
	}, [empno, show]);

	const handleNotificationClick = (notificationId, targetUrl) => {
		axios.get(`/api/notifications/${notificationId}`)
			.then(() => {
				// 알림을 읽음 처리한 후, 대상 URL로 이동
				const roomId = targetUrl.split('/').pop();
				navigate('/chat', { state: { roomId } });  // state로 roomId 전달하여 chat로 이동
			})
			.catch(error => console.error('Error marking notification as read:', error));
	};

	return (
		<Modal show={show} onHide={onClose}>
			<Modal.Header closeButton>
				<Modal.Title>알림</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{notifications.length > 0 ? (
					<ul className="list-group">
						{notifications.map(notification => (
							<li
								key={notification.id}
								className={`list-group-item ${notification.read ? '' : 'list-group-item-warning'}`}
								onClick={() => handleNotificationClick(notification.id, notification.targetUrl)} 
								style={{ cursor: 'pointer' }} 
							>
								<div>
									{notification.content}
								</div>
							</li>
						))}
					</ul>
				) : (
					<p>알림이 없습니다.</p>
				)}
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={onClose}>닫기</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default NotificationModal;
