import React, { useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

let stompClient = null;

const ChatPage = () => {
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [employeeName, setEmployeeName] = useState('');
    const [chatRooms, setChatRooms] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    useEffect(() => {
        connect();
        fetchChatRooms();
    }, []);

    const connect = () => {
        const socket = new SockJS('/ws');
        stompClient = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: onConnected,
            onStompError: onError,
        });
        stompClient.activate();
    };

    const onConnected = () => {
        stompClient.subscribe('/topic/public', onMessageReceived);
    };

    const onError = (error) => {
        console.error('Could not connect to WebSocket server. Please refresh this page to try again!');
    };

    const onMessageReceived = (message) => {
        const newMessage = JSON.parse(message.body);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    const sendMessage = () => {
        const messageContent = messageInput.trim();
        if (messageContent && stompClient) {
            const chatMessage = {
                sender: sessionStorage.getItem('empno'),
                content: messageContent,
                type: 'CHAT'
            };
            stompClient.publish({ destination: '/app/chat.sendMessage', body: JSON.stringify(chatMessage) });
            setMessageInput('');
        }
    };

    const fetchChatRooms = async () => {
        try {
            const response = await fetch(`/api/chat/rooms/participant?participant=${sessionStorage.getItem('empno')}`);
            const data = await response.json();
            setChatRooms(data);
        } catch (error) {
            console.error("Failed to fetch chat rooms:", error);
        }
    };

    const handleSearch = async () => {
        try {
            const encodedName = encodeURIComponent(employeeName);
            const response = await fetch(`/api/employees/search?name=${encodedName}`);
            const employees = await response.json();
            if (employees.length > 0) {
                setSelectedEmployee(employees[0]); // 첫 번째 검색 결과 선택
                setShowModal(true); // 모달 띄우기
            } else {
                alert('사용자를 찾을 수 없습니다.');
            }
        } catch (error) {
            console.error("Failed to search employees:", error);
        }
    };

    const handleStartChat = async () => {
        if (selectedEmployee) {
            const roomName = `${sessionStorage.getItem('empno')}-${selectedEmployee.ename}`;
            await fetch(`/api/chat/create?roomName=${roomName}&participants=${sessionStorage.getItem('empno')},${selectedEmployee.empno}`, {
                method: 'POST'
            });
            fetchChatRooms(); // 채팅방 목록 갱신
            setShowModal(false); // 모달 닫기
        }
    };

    return (
        <div>
            <h2>채팅 페이지</h2>
            <input
                type="text"
                placeholder="사원 이름 검색"
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
            />
            <button onClick={handleSearch}>검색</button>

            <h3>내 채팅방 목록</h3>
            <ul>
                {chatRooms.map((room) => (
                    <li key={room.id}>{room.roomName}</li>
                ))}
            </ul>

            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>{msg.sender}: {msg.content}</li>
                ))}
            </ul>
            <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
            />
            <button onClick={sendMessage}>전송</button>

            {/* 모달 */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>채팅 시작</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedEmployee && `${selectedEmployee.ename}님과 채팅을 시작하시겠습니까?`}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        취소
                    </Button>
                    <Button variant="primary" onClick={handleStartChat}>
                        확인
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ChatPage;
