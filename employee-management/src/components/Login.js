import React, { useState } from 'react';
import authService from '../services/authService';

const Login = () => {
  const [empno, setEmpno] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.login(empno, password);
      sessionStorage.setItem('empno', empno); // 로그인 성공 시 사원번호 저장
      window.location.href = '/'; // 홈 화면으로 리다이렉트
    } catch (error) {
      alert('로그인 실패: 아이디 또는 비밀번호를 확인하세요.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">로그인</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>사원번호</label>
          <input
            type="text"
            className="form-control"
            value={empno}
            onChange={(e) => setEmpno(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>비밀번호</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">로그인</button>
      </form>
    </div>
  );
};

export default Login;
