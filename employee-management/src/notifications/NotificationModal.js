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

    const handleNotificationClick = (notificationId, targetUrl) => {
        axios.get(`/api/notifications/${notificationId}`)
            .then(() => {
                const roomId = targetUrl.split('/').pop();
                navigate('/chat', { state: { roomId } });
            })
            .catch(error => console.error('Error marking notification as read:', error));
    };

    const handleDeleteNotification = (notificationId) => {
        axios.post(`/api/notifications/delete/${notificationId}`)
            .then(() => {
                // 알림 삭제 후 다시 목록 불러오기
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
                                    <small>{new Date(notification.createdAt).toLocaleString()}</small>
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
