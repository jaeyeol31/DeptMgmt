import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import EmployeeList from './components/EmployeeList';
import EmployeeDetail from './components/EmployeeDetail';
import EmployeeForm from './components/EmployeeForm';
import Login from './components/Login';
import MyPage from './components/MyPage';
import authService from './services/authService';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = () => {
  const navigate = useNavigate();
  const empno = sessionStorage.getItem('empno'); // 세션에서 사원번호를 가져옴

  const handleLogout = () => {
    authService.logout().then(() => {
      sessionStorage.removeItem('empno'); // 로그아웃 시 사원번호 제거
      navigate('/'); // 로그아웃 후 홈으로 리다이렉트
    });
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link className="navbar-brand" to="/">부서 관리 시스템</Link>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className="nav-link" to="/">홈화면</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/">전체 목록</Link>
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
          <Route path="/" element={<EmployeeList />} />
          <Route path="/view/:id" element={<EmployeeDetail />} />
          <Route path="/add" element={<EmployeeForm />} />
          <Route path="/edit/:id" element={<EmployeeForm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/mypage" element={<MyPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
