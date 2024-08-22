import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import EmployeeList from './emp/EmployeeList';
import EmployeeDetail from './emp/EmployeeDetail';
import EmployeeForm from './emp/EmployeeForm';
import DeptList from './dept/DeptList';
import DeptForm from './dept/DeptForm';
import DeptDetail from './dept/DeptDetail';
import NoticeList from './notice/NoticeList';
import NoticeForm from './notice/NoticeForm';
import NoticeDetail from './notice/NoticeDetail';
import DepartmentBoardList from './department/DepartmentBoardList'; 
import DepartmentBoardForm from './department/DepartmentBoardForm'; 
import DepartmentBoardDetail from './department/DepartmentBoardDetail'; 
import Login from './user/Login';
import MyPage from './user/MyPage';
import ChangePassword from './user/ChangePassword';
import Home from './home/Home';  // Home 컴포넌트 경로 수정
import authService from './services/authService';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './assets/images/logo.png';

const Navbar = () => {
  const navigate = useNavigate();
  const empno = sessionStorage.getItem('empno');
  const [timeLeft, setTimeLeft] = useState(null);
  const [intervalId, setIntervalId] = useState(null);

  const handleLogout = () => {
    authService.logout().then(() => {
      sessionStorage.removeItem('empno');
      clearInterval(intervalId);
      navigate('/');
    });
  };

  const checkSessionTime = () => {
    const sessionStartTime = parseInt(sessionStorage.getItem('sessionStartTime'), 10);
    const sessionTimeout = parseInt(sessionStorage.getItem('sessionTimeout'), 10);

    if (!isNaN(sessionStartTime) && !isNaN(sessionTimeout)) {
      const currentTime = Date.now();
      const timeLeft = sessionStartTime + sessionTimeout - currentTime;

      if (timeLeft > 0) {
        setTimeLeft(Math.floor(timeLeft / 1000));  // 1초 단위로 시간 계산
      } else {
        setTimeLeft(0);
        clearInterval(intervalId);
        alert('세션이 만료되었습니다. 다시 로그인해주세요.');
        handleLogout();
      }

      if (timeLeft <= 30000 && timeLeft > 0) { // 30초 남았을 때
        if (window.confirm('세션이 곧 만료됩니다. 연장하시겠습니까?')) {
          axios.get('/api/auth/extend-session')
            .then(() => {
              const newSessionStartTime = Date.now();
              sessionStorage.setItem('sessionStartTime', newSessionStartTime);
              setTimeLeft(sessionTimeout / 1000); // 세션 타임아웃 초기화
              alert('세션이 연장되었습니다.');
            })
            .catch(error => {
              console.error('세션 연장 중 오류가 발생했습니다.', error);
            });
        }
      }
    } else {
      setTimeLeft(null);
    }
  };

  useEffect(() => {
    const sessionTimeout = 600000; // 10분 (600,000 밀리초)
    const sessionStartTime = Date.now();

    sessionStorage.setItem('sessionStartTime', sessionStartTime.toString());
    sessionStorage.setItem('sessionTimeout', sessionTimeout.toString());

    const intervalId = setInterval(checkSessionTime, 1000); // 1초마다 체크
    setIntervalId(intervalId);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light" style={styles.navbar}>
      <Link className="navbar-brand" to="/">
        <img src={logo} alt="WODUF Logo" style={styles.logo} />
      </Link>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className="nav-link" to="/">홈</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/employees">사원 목록</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/departments">부서 목록</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/notices">공지사항</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/department-board">부서 게시판</Link>
          </li>
          {empno ? (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/mypage">마이페이지</Link>
              </li>
              <li className="nav-item">
                <button className="nav-link btn btn-link" onClick={handleLogout} style={styles.logoutButton}>로그아웃</button>
              </li>
              <li className="nav-item">
                <span className="nav-link">
                  {timeLeft !== null ? `세션 만료까지 남은 시간: ${timeLeft}초` : '세션 정보 없음'}
                </span>
              </li>
            </>
          ) : (
            <li className="nav-item">
              <Link className="nav-link" to="/login">로그인</Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    marginBottom: '20px',
  },
  logo: {
    height: '40px',
  },
  logoutButton: {
    cursor: 'pointer',
    padding: '0',
    border: 'none',
    background: 'none',
    color: '#007bff',
    textDecoration: 'underline',
  },
};

const App = () => {
  return (
    <Router>
      <div className="container">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/employees" element={<EmployeeList />} />
          <Route path="/view/:id" element={<EmployeeDetail />} />
          <Route path="/add" element={<EmployeeForm />} />
          <Route path="/edit/:id" element={<EmployeeForm />} />
          <Route path="/departments" element={<DeptList />} />
          <Route path="/departments/add" element={<DeptForm />} />
          <Route path="/departments/edit/:id" element={<DeptForm />} />
          <Route path="/departments/detail/:deptno" element={<DeptDetail />} />
          <Route path="/notices" element={<NoticeList />} />
          <Route path="/notices/add" element={<NoticeForm />} />
          <Route path="/notices/edit/:id" element={<NoticeForm />} />
          <Route path="/notices/detail/:id" element={<NoticeDetail />} />
          <Route path="/department-board" element={<DepartmentBoardList />} />
          <Route path="/department-board/create" element={<DepartmentBoardForm />} />
          <Route path="/department-board/edit/:id" element={<DepartmentBoardForm />} />
          <Route path="/department-board/:id" element={<DepartmentBoardDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/change-password" element={<ChangePassword />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
