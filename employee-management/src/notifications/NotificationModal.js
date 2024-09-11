import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';

const NotificationModal = ({ show, onClose, empno }) => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (empno && show) {
            axios.get(`/api/notifications/employee/${empno}`)
                .then(response => setNotifications(response.data))
                .catch(error => console.error('Error fetching notifications:', error));
        }
    }, [empno, show]);

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>알림</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {notifications.length > 0 ? (
                    <ul className="list-group">
                        {notifications.map(notification => (
                            <li key={notification.id} className={`list-group-item ${notification.read ? '' : 'list-group-item-warning'}`}>
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
