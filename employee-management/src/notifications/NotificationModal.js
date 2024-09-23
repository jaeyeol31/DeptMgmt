import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const NotificationModal = ({ show, onClose, empno }) => {
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (empno && show) {
            axios.get(`/api/notifications/employee/${empno}`)
                .then(response => {
                    // 시간 순으로 내림차순 정렬 (최신 알림이 위로 오도록)
                    const sortedNotifications = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    setNotifications(sortedNotifications);
                })
                .catch(error => console.error('Error fetching notifications:', error));
        }
    }, [empno, show]);

    // 알림을 클릭하여 읽음 처리 후, 상태 업데이트 및 페이지 이동
    const handleNotificationClick = (notificationId, targetUrl) => {
        axios.get(`/api/notifications/${notificationId}`)
            .then(() => {
                // 읽음 처리 후 알림 상태 업데이트
                setNotifications(prevNotifications =>
                    prevNotifications.map(notification =>
                        notification.id === notificationId
                            ? { ...notification, read: true }
                            : notification
                    )
                );
                // 모달 창 닫기
                onClose();
                // 알림 URL로 이동
                const roomId = targetUrl.split('/').pop();
                navigate('/chat', { state: { roomId } });
            })
            .catch(error => console.error('Error marking notification as read:', error));
    };

    // 알림 삭제 함수
    const handleDeleteNotification = (notificationId) => {
        axios.post(`/api/notifications/delete/${notificationId}/${empno}`)
            .then(() => {
                // 알림 삭제 후 목록 업데이트
                setNotifications(notifications.filter(notification => notification.id !== notificationId));
            })
            .catch(error => console.error('Error deleting notification:', error));
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
                                style={{ cursor: 'pointer' }}
                            >
                                <div onClick={() => handleNotificationClick(notification.id, notification.targetUrl)}>
                                    <strong>{notification.notificationType}:</strong> {notification.content}
                                </div>
                                <div>
                                    <small>{new Date(notification.createdAt).toLocaleDateString('ko-KR', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}</small>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        className="float-right"
                                        onClick={() => handleDeleteNotification(notification.id)}
                                    >
                                        삭제
                                    </Button>
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
