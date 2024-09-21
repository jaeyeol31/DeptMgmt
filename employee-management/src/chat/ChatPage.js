import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useLocation } from 'react-router-dom';

let stompClient = null;

const styles = {
    chatPage: {
        display: 'flex',
        height: '100vh',
    },
    chatSidebar: {
        width: '300px',
        padding: '20px',
        borderRight: '1px solid #ddd',
        backgroundColor: '#f8f9fa',
    },
    chatContent: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    chatHeader: {
        padding: '10px',
        borderBottom: '1px solid #ddd',
        backgroundColor: '#f1f1f1',
    },
    chatMessages: {
        flex: 1,
        padding: '20px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
    },
    dateLabel: {
        alignSelf: 'center',
        margin: '10px 0',
        padding: '5px 10px',
        backgroundColor: '#e4e6eb',
        borderRadius: '10px',
        color: '#555',
    },
    chatMessage: {
        marginBottom: '10px',
        display: 'flex',
        maxWidth: '60%',
    },
    sent: {
        alignSelf: 'flex-end',
        textAlign: 'right',
        backgroundColor: '#dcf8c6',
        padding: '10px',
        borderRadius: '10px',
    },
    received: {
        alignSelf: 'flex-start',
        textAlign: 'left',
        backgroundColor: '#fff',
        padding: '10px',
        borderRadius: '10px',
        border: '1px solid #ddd',
    },
    timeLabel: {
        fontSize: '0.8em',
        color: '#888',
        marginLeft: '10px',
        alignSelf: 'flex-end',
    },
    chatInputArea: {
        display: 'flex',
        padding: '10px',
        borderTop: '1px solid #ddd',
        backgroundColor: '#f1f1f1',
    },
    chatInput: {
        flex: 1,
        marginRight: '10px',
    },
};

const ChatPage = () => {
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [employeeName, setEmployeeName] = useState('');
    const [chatRooms, setChatRooms] = useState([]);
    const [selectedChatRoom, setSelectedChatRoom] = useState(null);
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [employeeCache, setEmployeeCache] = useState({});
    const location = useLocation();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        connect();
        fetchChatRooms();
    }, []);

    useEffect(() => {
        if (selectedChatRoom && stompClient && stompClient.connected) {
            const subscription = stompClient.subscribe(`/topic/chatroom/${selectedChatRoom.id}`, onMessageReceived);
            return () => subscription.unsubscribe();
        }
    }, [selectedChatRoom]);

    useEffect(() => {
        const roomIdFromUrl = location.state?.roomId;
        if (roomIdFromUrl && chatRooms.length > 0) {
            const roomToSelect = chatRooms.find(room => room.id === Number(roomIdFromUrl));
            if (roomToSelect) {
                openChatRoom(roomToSelect);
            }
        }
    }, [location.state, chatRooms]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const connect = () => {
        const socket = new SockJS('http://localhost:8080/ws');
        stompClient = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: onConnected,
        });
        stompClient.activate();
    };

    const onConnected = () => {
        console.log("Connected to WebSocket");
    };

    const onMessageReceived = async (message) => {
        if (message.body) {
            const newMessage = JSON.parse(message.body);
            const senderName = await fetchEmployeeName(newMessage.senderId);
            setMessages((prevMessages) => [...prevMessages, { ...newMessage, senderName }]);
        }
    };

    const fetchEmployeeName = async (empno) => {
        if (employeeCache[empno]) {
            return employeeCache[empno];
        }
        const response = await fetch(`/api/messages/employee/${empno}`);
        const employee = await response.json();
        setEmployeeCache(prevCache => ({ ...prevCache, [empno]: employee.ename }));
        return employee.ename;
    };

    const sendMessage = async () => {
        const messageContent = messageInput.trim();
        if (messageContent && stompClient && selectedChatRoom) {
            const chatMessage = {
                senderId: sessionStorage.getItem('empno'),
                roomId: selectedChatRoom.id,
                content: messageContent,
                createdAt: new Date().toISOString(),
            };
            stompClient.publish({
                destination: '/pub/message',
                body: JSON.stringify(chatMessage),
            });

            await fetch('http://localhost:8080/api/messages/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(chatMessage),
            });

            setMessageInput('');
            fetchMessages(selectedChatRoom.id);
        }
    };

    const fetchMessages = async (roomId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/messages/room/${roomId}`);
            const data = await response.json();
            const sortedMessages = data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

            for (const message of sortedMessages) {
                message.senderName = await fetchEmployeeName(message.senderId);
            }
            setMessages(sortedMessages);
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        }
    };

    const fetchChatRooms = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/chat/rooms/participant?participant=${sessionStorage.getItem('empno')}`);
            const data = await response.json();
            setChatRooms(data);
        } catch (error) {
            console.error('Failed to fetch chat rooms:', error);
        }
    };

    const handleSearch = async (e) => {
        setEmployeeName(e.target.value);
        if (e.target.value.length > 1) {
            const encodedName = encodeURIComponent(e.target.value);
            const response = await fetch(`http://localhost:8080/api/employees/search?name=${encodedName}`);
            const employees = await response.json();
            setSearchResults(employees);
        } else {
            setSearchResults([]);
        }
    };

    const handleCheckboxChange = (employee) => {
        const alreadySelected = selectedEmployees.find((e) => e.empno === employee.empno);
        if (alreadySelected) {
            setSelectedEmployees(selectedEmployees.filter((e) => e.empno !== employee.empno));
        } else {
            setSelectedEmployees([...selectedEmployees, employee]);
        }
    };

    const handleStartChat = async () => {
        const empnoSelf = sessionStorage.getItem('empno');
        const filteredEmployees = selectedEmployees.filter((emp) => emp.empno !== empnoSelf);

        if (filteredEmployees.length > 0) {
            const participantEmpnos = filteredEmployees.map((emp) => emp.empno).join(',');
            await fetch(`http://localhost:8080/api/chat/create?participants=${participantEmpnos}&empnoSelf=${empnoSelf}`, { method: 'POST' });
            fetchChatRooms();
            setSelectedEmployees([]);
        } else {
            alert("본인과는 채팅할 수 없습니다.");
        }
    };

    const openChatRoom = (room) => {
        setSelectedChatRoom(room);
        setMessages([]);
        fetchMessages(room.id);
    };

    const renderMessages = () => {
        let lastMessageDate = null;

        return messages.map((msg, index) => {
            const messageDate = new Date(msg.createdAt).setHours(0, 0, 0, 0);
            const shouldShowDateLabel = !lastMessageDate || messageDate !== lastMessageDate;
            lastMessageDate = messageDate;

            return (
                <React.Fragment key={index}>
                    {shouldShowDateLabel && (
                        <div style={styles.dateLabel}>{new Date(msg.createdAt).toLocaleDateString()}</div>
                    )}
                    <div
                        style={{
                            ...styles.chatMessage,
                            ...(msg.senderId === parseInt(sessionStorage.getItem('empno'))
                                ? styles.sent
                                : styles.received),
                        }}
                    >
                        <Card>
                            <Card.Header>
                                {msg.senderName}
                                <span style={styles.timeLabel}>{new Date(msg.createdAt).toLocaleTimeString()}</span>
                            </Card.Header>
                            <Card.Body>{msg.content}</Card.Body>
                        </Card>
                    </div>
                </React.Fragment>
            );
        });
    };

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div style={styles.chatPage}>
            <div style={styles.chatSidebar}>
                <h2>채팅</h2>
                <Form.Control
                    type="text"
                    placeholder="사원 이름 검색"
                    value={employeeName}
                    onChange={handleSearch}
                    className="mb-3"
                />
                <ListGroup variant="flush">
                    {searchResults.map((employee) => (
                        <ListGroup.Item key={employee.empno}>
                            <Form.Check
                                type="checkbox"
                                label={`${employee.ename} (사원번호: ${employee.empno})`}
                                checked={!!selectedEmployees.find((e) => e.empno === employee.empno)}
                                onChange={() => handleCheckboxChange(employee)}
                            />
                        </ListGroup.Item>
                    ))}
                </ListGroup>

                {selectedEmployees.length > 0 && (
                    <div className="mt-3">
                        <h5>선택된 사용자:</h5>
                        <ul>
                            {selectedEmployees.map((emp) => (
                                <li key={emp.empno}>{`${emp.ename} (사원번호: ${emp.empno})`}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <Button variant="primary" onClick={handleStartChat}>채팅 시작</Button>

                <h3 className="mt-4">내 채팅방</h3>
                <ListGroup variant="flush">
                    {chatRooms.map((room) => (
                        <ListGroup.Item key={room.id} action onClick={() => openChatRoom(room)}>
                            {room.roomName}
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </div>

            <div style={styles.chatContent}>
                <div style={styles.chatHeader}>
                    <h4>{selectedChatRoom?.roomName || '채팅방을 선택하세요'}</h4>
                </div>
                <div style={styles.chatMessages}>
                    {renderMessages()}
                    <div ref={messagesEndRef}></div>
                </div>
                <div style={styles.chatInputArea}>
                    <Form.Control
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="메시지 입력..."
                        style={styles.chatInput}
                    />
                    <Button variant="primary" onClick={sendMessage}>전송</Button>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
