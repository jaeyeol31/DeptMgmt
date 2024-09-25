import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';  // SockJS는 WebSocket을 사용하는 클라이언트를 위한 JavaScript 라이브러리
import { Client } from '@stomp/stompjs';  // STOMP 클라이언트 라이브러리, 메시지 전송을 위한 프로토콜
import ListGroup from 'react-bootstrap/ListGroup';  // 부트스트랩 컴포넌트
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useLocation } from 'react-router-dom';  // 현재 URL의 state를 사용하기 위한 hook

let stompClient = null;  // STOMP 클라이언트를 전역적으로 사용하기 위한 변수

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
    // 상태 변수 정의
    const [messages, setMessages] = useState([]);  // 현재 채팅방의 메시지 목록
    const [messageInput, setMessageInput] = useState('');  // 입력된 메시지 내용
    const [employeeName, setEmployeeName] = useState('');  // 검색된 직원 이름
    const [chatRooms, setChatRooms] = useState([]);  // 참여 중인 채팅방 목록
    const [selectedChatRoom, setSelectedChatRoom] = useState(null);  // 현재 선택된 채팅방
    const [selectedEmployees, setSelectedEmployees] = useState([]);  // 채팅에 초대할 직원 목록
    const [searchResults, setSearchResults] = useState([]);  // 검색 결과로 나타나는 직원 목록
    const [employeeCache, setEmployeeCache] = useState({});  // 직원 이름 캐시, API 호출을 줄이기 위해 사용
    const location = useLocation();  // URL 상태에 접근하여 roomId를 받기 위한 hook
    const messagesEndRef = useRef(null);  // 메시지 목록의 끝부분을 가리키는 참조 변수 (scroll 조작용)

    // 첫 렌더링 시 WebSocket 연결 및 채팅방 목록 가져오기
    useEffect(() => {
        connect();  // WebSocket 연결
        fetchChatRooms();  // 채팅방 목록 가져오기
    }, []);

    // 선택된 채팅방이 있을 경우 해당 채팅방의 메시지를 구독
    useEffect(() => {
        if (selectedChatRoom && stompClient && stompClient.connected) {
            const subscription = stompClient.subscribe(`/topic/chatroom/${selectedChatRoom.id}`, onMessageReceived);
            return () => subscription.unsubscribe();  // 채팅방이 바뀌거나 연결이 끊기면 구독 해제
        }
    }, [selectedChatRoom]);

    // URL로 전달받은 roomId가 있을 경우 해당 채팅방 자동으로 열기
    useEffect(() => {
        const roomIdFromUrl = location.state?.roomId;  // URL로부터 roomId 추출
        if (roomIdFromUrl && chatRooms.length > 0) {
            const roomToSelect = chatRooms.find(room => room.id === Number(roomIdFromUrl));
            if (roomToSelect) {
                openChatRoom(roomToSelect);  // roomId에 해당하는 채팅방 열기
            }
        }
    }, [location.state, chatRooms]);

    // 메시지가 추가되면 스크롤을 가장 아래로 자동으로 이동
    useEffect(() => {
        scrollToBottom();  
    }, [messages]);

    // WebSocket 연결 설정 함수
    const connect = () => {
        const socket = new SockJS('http://localhost:8080/ws');  // WebSocket 서버 URL
        stompClient = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,  // 재연결 시도 시간 설정
            onConnect: onConnected,  // 연결 성공 시 호출될 함수
        });
        stompClient.activate();  // WebSocket 연결 활성화
    };

    // WebSocket 연결 성공 시 호출되는 함수
    const onConnected = () => {
        console.log("Connected to WebSocket");
    };

    // 메시지를 수신했을 때 호출되는 함수
    const onMessageReceived = async (message) => {
        if (message.body) {
            const newMessage = JSON.parse(message.body);  // 수신된 메시지 파싱
            const senderName = await fetchEmployeeName(newMessage.senderId);  // 발신자 이름 가져오기
            setMessages((prevMessages) => [...prevMessages, { ...newMessage, senderName }]);  // 메시지 추가
        }
    };

    // 사원 이름을 캐시 또는 서버에서 가져오는 함수
    const fetchEmployeeName = async (empno) => {
        if (employeeCache[empno]) {
            return employeeCache[empno];  // 이미 캐시에 있는 경우 캐시에서 이름 반환
        }
        const response = await fetch(`/api/messages/employee/${empno}`);  // 서버에 요청하여 이름 가져오기
        const employee = await response.json();
        setEmployeeCache(prevCache => ({ ...prevCache, [empno]: employee.ename }));  // 캐시에 저장
        return employee.ename;
    };

    // 메시지를 서버로 전송하는 함수
    const sendMessage = async () => {
        const messageContent = messageInput.trim();  // 입력된 메시지의 공백 제거
        if (messageContent && stompClient && selectedChatRoom) {
            const chatMessage = {
                senderId: sessionStorage.getItem('empno'),  // 현재 로그인한 사원의 ID
                roomId: selectedChatRoom.id,  // 현재 선택된 채팅방 ID
                content: messageContent,  // 전송할 메시지 내용
                createdAt: new Date().toISOString(),  // 메시지 전송 시간
            };
            stompClient.publish({
                destination: '/pub/message',  // 메시지를 전송할 경로
                body: JSON.stringify(chatMessage),  // 메시지를 JSON 형식으로 변환하여 전송
            });

            // 서버에 메시지 저장 요청
            await fetch('http://localhost:8080/api/messages/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(chatMessage),  // 메시지 내용을 요청 바디에 포함
            });

            setMessageInput('');  // 메시지 입력창 초기화
            fetchMessages(selectedChatRoom.id);  // 최신 메시지 목록 가져오기
        }
    };

    // 특정 채팅방의 메시지를 서버에서 가져오는 함수
    const fetchMessages = async (roomId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/messages/room/${roomId}`);
            const data = await response.json();
            const sortedMessages = data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));  // 메시지를 시간순으로 정렬

            for (const message of sortedMessages) {
                message.senderName = await fetchEmployeeName(message.senderId);  // 각 메시지의 발신자 이름을 가져옴
            }
            setMessages(sortedMessages);  // 메시지 상태 업데이트
        } catch (error) {
            console.error('Failed to fetch messages:', error);  // 메시지 가져오기 실패 시 에러 로그 출력
        }
    };

    // 현재 사원이 속한 채팅방 목록을 가져오는 함수
    const fetchChatRooms = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/chat/rooms/participant?participant=${sessionStorage.getItem('empno')}`);
            const data = await response.json();
            setChatRooms(data);  // 채팅방 목록 업데이트
        } catch (error) {
            console.error('Failed to fetch chat rooms:', error);  // 채팅방 목록 가져오기 실패 시 에러 로그 출력
        }
    };

    // 사원 이름을 검색하는 함수
    const handleSearch = async (e) => {
        setEmployeeName(e.target.value);
        if (e.target.value.length > 1) {  // 검색어가 2글자 이상일 때만 검색 수행
            const encodedName = encodeURIComponent(e.target.value);  // 검색어 URL 인코딩
            const response = await fetch(`http://localhost:8080/api/employees/search?name=${encodedName}`);
            const employees = await response.json();
            setSearchResults(employees);  // 검색 결과 업데이트
        } else {
            setSearchResults([]);  // 검색어가 짧으면 결과 초기화
        }
    };

    // 선택한 사원을 채팅에 초대할 목록에 추가/제거하는 함수
    const handleCheckboxChange = (employee) => {
        const alreadySelected = selectedEmployees.find((e) => e.empno === employee.empno);
        if (alreadySelected) {
            setSelectedEmployees(selectedEmployees.filter((e) => e.empno !== employee.empno));  // 이미 선택된 사원은 목록에서 제거
        } else {
            setSelectedEmployees([...selectedEmployees, employee]);  // 선택되지 않은 사원은 목록에 추가
        }
    };

    // 선택된 사원들과 새로운 채팅방을 생성하는 함수
    const handleStartChat = async () => {
        const empnoSelf = sessionStorage.getItem('empno');  // 현재 로그인한 사원 번호
        const filteredEmployees = selectedEmployees.filter((emp) => emp.empno !== empnoSelf);  // 본인을 제외한 사원들만 필터링

        if (filteredEmployees.length > 0) {
            const participantEmpnos = filteredEmployees.map((emp) => emp.empno).join(',');
            await fetch(`http://localhost:8080/api/chat/create?participants=${participantEmpnos}&empnoSelf=${empnoSelf}`, { method: 'POST' });
            fetchChatRooms();  // 채팅방 목록 다시 가져오기
            setSelectedEmployees([]);  // 선택된 사원 목록 초기화
        } else {
            alert("본인과는 채팅할 수 없습니다.");  // 본인을 선택한 경우 경고 메시지
        }
    };

    // 채팅방을 열고 메시지 목록을 가져오는 함수
    const openChatRoom = (room) => {
        setSelectedChatRoom(room);  // 선택된 채팅방 설정
        setMessages([]);  // 메시지 목록 초기화
        fetchMessages(room.id);  // 해당 채팅방의 메시지 가져오기
    };

    // 메시지 렌더링 함수
    const renderMessages = () => {
        let lastMessageDate = null;  // 마지막 메시지의 날짜

        return messages.map((msg, index) => {
            const messageDate = new Date(msg.createdAt).setHours(0, 0, 0, 0);  // 메시지의 날짜만 추출
            const shouldShowDateLabel = !lastMessageDate || messageDate !== lastMessageDate;  // 날짜가 바뀌었는지 확인
            lastMessageDate = messageDate;

            return (
                <React.Fragment key={index}>
                    {shouldShowDateLabel && (
                        <div style={styles.dateLabel}>{new Date(msg.createdAt).toLocaleDateString()}</div>  // 날짜 라벨 표시
                    )}
                    <div
                        style={{
                            ...styles.chatMessage,
                            ...(msg.senderId === parseInt(sessionStorage.getItem('empno'))
                                ? styles.sent
                                : styles.received),  // 메시지를 보낸 사람이 현재 로그인한 사용자와 같은지 확인
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

    // 메시지 목록의 끝으로 스크롤하는 함수
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
