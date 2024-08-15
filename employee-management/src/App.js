import React from 'react';
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
import Login from './user/Login';
import MyPage from './user/MyPage';
import ChangePassword from './user/ChangePassword';
import Home from './Home';
import authService from './services/authService';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './assets/images/logo.png';

const Navbar = () => {
  const navigate = useNavigate();
  const empno = sessionStorage.getItem('empno');

  const handleLogout = () => {
    authService.logout().then(() => {
      sessionStorage.removeItem('empno');
      navigate('/'); 
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
          <li className="nav-item">
            <Link className="nav-link" to="/notices">공지사항</Link> {/* 공지사항 링크 추가 */}
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
          <Route path="/" element={<Home />} />
          <Route path="/employees" element={<EmployeeList />} />
          <Route path="/view/:id" element={<EmployeeDetail />} />
          <Route path="/add" element={<EmployeeForm />} />
          <Route path="/edit/:id" element={<EmployeeForm />} />
          <Route path="/departments" element={<DeptList />} />
          <Route path="/departments/add" element={<DeptForm />} />
          <Route path="/departments/edit/:id" element={<DeptForm />} />
          <Route path="/departments/detail/:deptno" element={<DeptDetail />} />
          <Route path="/notices" element={<NoticeList />} />  {/* 추가 */}
          <Route path="/notices/add" element={<NoticeForm />} />  {/* 추가 */}
          <Route path="/notices/edit/:id" element={<NoticeForm />} />  {/* 추가 */}
          <Route path="/notices/detail/:id" element={<NoticeDetail />} />  {/* 추가 */}
          <Route path="/login" element={<Login />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/change-password" element={<ChangePassword />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
