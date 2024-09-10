import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

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
    
    // 채팅 메시지 영역에 대한 ref 생성
    const messagesEndRef = useRef(null);

    useEffect(() => {
        connect();
        fetchChatRooms();
    }, []);

    useEffect(() => {
        if (selectedChatRoom && stompClient && stompClient.connected) {
            const subscription = stompClient.subscribe(`/topic/chatroom/${selectedChatRoom.id}`, onMessageReceived);
            console.log(`Subscribed to chat room ID: ${selectedChatRoom.id}`);
            return () => subscription.unsubscribe();
        }
    }, [selectedChatRoom]);

    // 메시지가 추가될 때마다 스크롤을 맨 아래로 이동
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const connect = () => {
        console.log("Attempting to connect to WebSocket...");
        const socket = new SockJS('http://localhost:8080/ws');
        stompClient = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: onConnected,
            onStompError: (frame) => {
                console.error("STOMP Error:", frame.headers['message'], frame.body);
            },
            onDisconnect: () => console.log("WebSocket disconnected"),
            onWebSocketError: (error) => console.error("WebSocket error:", error),
            onWebSocketClose: () => console.log("WebSocket closed"),
        });
        stompClient.activate();
    };

    const onConnected = () => {
        console.log("Connected to WebSocket");
    };

    const onMessageReceived = async (message) => {
        console.log("Raw message received:", message);
        if (message.body) {
            const newMessage = JSON.parse(message.body);
            console.log("Parsed message:", newMessage);

            const senderName = await fetchEmployeeName(newMessage.senderId);

            setMessages((prevMessages) => [...prevMessages, { ...newMessage, senderName }]);

            console.log("Messages state updated:", messages);
        } else {
            console.warn("Received message has no body:", message);
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
            console.log("Sending message:", chatMessage);

            stompClient.publish({
                destination: '/pub/message',
                body: JSON.stringify(chatMessage),
            });

            console.log("Message published to WebSocket");

            const response = await fetch('http://localhost:8080/api/messages/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(chatMessage),
            });

            const result = await response.json();
            console.log("Message saved on server:", result);

            setMessageInput('');

            fetchMessages(selectedChatRoom.id);
        } else {
            console.warn("Message content empty or STOMP client not connected");
        }
    };

    const fetchMessages = async (roomId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/messages/room/${roomId}`);
            const data = await response.json();
            const sortedMessages = data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            console.log("Messages fetched and sorted:", sortedMessages);

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
            console.log("Chat rooms fetched:", data);
            setChatRooms(data);
        } catch (error) {
            console.error('Failed to fetch chat rooms:', error);
        }
    };

    const handleSearch = async (e) => {
        setEmployeeName(e.target.value);
        try {
            if (e.target.value.length > 1) {
                const encodedName = encodeURIComponent(e.target.value);
                const response = await fetch(`http://localhost:8080/api/employees/search?name=${encodedName}`);
                const employees = await response.json();
                console.log("Search results:", employees);
                setSearchResults(employees);
            } else {
                setSearchResults([]);
            }
        } catch (error) {
            console.error('Failed to search employees:', error);
        }
    };

    const handleCheckboxChange = (employee) => {
        const alreadySelected = selectedEmployees.find((e) => e.empno === employee.empno);
        if (alreadySelected) {
            setSelectedEmployees(selectedEmployees.filter((e) => e.empno !== employee.empno));
        } else {
            setSelectedEmployees([...selectedEmployees, employee]);
        }
        console.log("Selected employees:", selectedEmployees);
    };

    const handleStartChat = async () => {
        const empnoSelf = sessionStorage.getItem('empno');
        const filteredEmployees = selectedEmployees.filter((emp) => emp.empno !== empnoSelf);

        if (filteredEmployees.length > 0) {
            const participantEmpnos = filteredEmployees.map((emp) => emp.empno).join(',');
            console.log("Starting chat with participants:", participantEmpnos);

            const response = await fetch(`http://localhost:8080/api/chat/create?participants=${participantEmpnos}&empnoSelf=${empnoSelf}`, {
                method: 'POST',
            });

            if (response.ok) {
                fetchChatRooms();
                setSelectedEmployees([]);
            } else {
                console.error('Failed to create chat room');
            }
        } else {
            alert("본인과는 채팅할 수 없습니다.");
        }
    };

    const openChatRoom = (room) => {
        console.log("Opening chat room:", room);
        setSelectedChatRoom(room);
        setMessages([]);
        fetchMessages(room.id);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
        });
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
        });
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
                        <div style={styles.dateLabel}>{formatDate(msg.createdAt)}</div>
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
                                <span style={styles.timeLabel}>{formatTime(msg.createdAt)}</span>
                            </Card.Header>
                            <Card.Body>{msg.content}</Card.Body>
                        </Card>
                    </div>
                </React.Fragment>
            );
        });
    };

    // 최신 메시지로 스크롤하는 함수
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
                                label={`${employee.ename} (사원번호: ${employee.empno}, 직급: ${employee.job})`}
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
                                <li key={emp.empno}>{`${emp.ename} (사원번호: ${emp.empno}, 직급: ${emp.job})`}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <Button variant="primary" onClick={handleStartChat} className="mt-3">
                    채팅 시작
                </Button>

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
                    {/* 메시지 끝에 ref 추가 */}
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
                    <Button variant="primary" onClick={sendMessage}>
                        전송
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
