import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';

import EmployeeList from './emp/EmployeeList';
import EmployeeDetail from './emp/EmployeeDetail';
import EmployeeForm from './emp/EmployeeForm';
import DeptList from './dept/DeptList';
import DeptForm from './dept/DeptForm';
import DeptDetail from './dept/DeptDetail';  // DeptDetail 추가
import Login from './user/Login';
import MyPage from './user/MyPage';
import ChangePassword from './user/ChangePassword';
import Home from './Home';  // 홈 컴포넌트 추가
import authService from './services/authService';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './assets/images/logo.png';

const Navbar = () => {
  const navigate = useNavigate();
  const empno = sessionStorage.getItem('empno');

  const handleLogout = () => {
    authService.logout().then(() => {
      sessionStorage.removeItem('empno');
      navigate('/'); // 로그아웃 후 홈으로 리다이렉트
    });
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link className="navbar-brand" to="/">
        <img src={logo} alt="WODUF Logo" style={{ height: '40px' }} />
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
          {empno ? (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/mypage">마이페이지</Link>
              </li>
              <li className="nav-item">
                <button className="nav-link btn btn-link" onClick={handleLogout}>로그아웃</button>
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

const App = () => {
  return (
    <Router>
      <div className="container">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />  {/* 홈화면을 기본 경로에 설정 */}
          <Route path="/employees" element={<EmployeeList />} />
          <Route path="/view/:id" element={<EmployeeDetail />} />
          <Route path="/add" element={<EmployeeForm />} />
          <Route path="/edit/:id" element={<EmployeeForm />} />
          <Route path="/departments" element={<DeptList />} />
          <Route path="/departments/add" element={<DeptForm />} />
          <Route path="/departments/edit/:id" element={<DeptForm />} />
          <Route path="/departments/detail/:deptno" element={<DeptDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/change-password" element={<ChangePassword />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
