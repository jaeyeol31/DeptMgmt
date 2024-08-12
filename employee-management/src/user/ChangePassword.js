import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmployeeService from '../services/EmployeeService';
import authService from '../services/authService';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPasswordError, setCurrentPasswordError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  const specialCharacters = '@$!%*?&';

  const validateCurrentPassword = (password) => {
    if (!password) {
      setCurrentPasswordError('현재 비밀번호를 입력하세요.');
      return false;
    } else {
      setCurrentPasswordError('');
      return true;
    }
  };

  const validateNewPassword = (password) => {
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

    if (!password) {
      setNewPasswordError('새로운 비밀번호를 입력하세요.');
      return false;
    } else if (!passwordRegex.test(password)) {
      setNewPasswordError(`비밀번호는 8~20자이며, 영어, 숫자, 특수문자(${specialCharacters})를 포함해야 합니다.`);
      return false;
    } else if (password === currentPassword) {
      setNewPasswordError('새로운 비밀번호는 현재 비밀번호와 달라야 합니다.');
      return false;
    } else {
      setNewPasswordError('');
      return true;
    }
  };

  const validateConfirmPassword = (password, confirmPassword) => {
    if (password !== confirmPassword) {
      setConfirmPasswordError('새로운 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return false;
    } else {
      setConfirmPasswordError('');
      return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isCurrentPasswordValid = validateCurrentPassword(currentPassword);
    const isNewPasswordValid = validateNewPassword(newPassword);
    const isConfirmPasswordValid = validateConfirmPassword(newPassword, confirmPassword);

    if (!isCurrentPasswordValid || !isNewPasswordValid || !isConfirmPasswordValid) {
      return;
    }

    try {
      const empno = sessionStorage.getItem('empno');
      await EmployeeService.changePassword({
        empno,
        currentPassword,
        newPassword,
      });

      setSuccessMessage('비밀번호가 성공적으로 변경되었습니다.');

      // 로그아웃 처리 및 로그인 페이지로 리다이렉트
      await authService.logout();
      navigate('/login');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setCurrentPasswordError('현재 비밀번호가 일치하지 않습니다.');
      } else {
        console.error('비밀번호 변경 실패:', error);
      }
    }
  };

  return (
    <div className="container">
      <h2>비밀번호 변경</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>현재 비밀번호</label>
          <input
            type="password"
            className={`form-control ${currentPasswordError ? 'is-invalid' : ''}`}
            value={currentPassword}
            onChange={(e) => {
              setCurrentPassword(e.target.value);
              validateCurrentPassword(e.target.value);
            }}
          />
          {currentPasswordError && <div className="invalid-feedback">{currentPasswordError}</div>}
        </div>

        <div className="form-group">
          <label>새로운 비밀번호</label>
          <input
            type="password"
            className={`form-control ${newPasswordError ? 'is-invalid' : ''}`}
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              validateNewPassword(e.target.value);
            }}
          />
          {newPasswordError && <div className="invalid-feedback">{newPasswordError}</div>}
        </div>

        <div className="form-group">
          <label>새로운 비밀번호 확인</label>
          <input
            type="password"
            className={`form-control ${confirmPasswordError ? 'is-invalid' : ''}`}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              validateConfirmPassword(newPassword, e.target.value);
            }}
          />
          {confirmPasswordError && <div className="invalid-feedback">{confirmPasswordError}</div>}
        </div>

        <button type="submit" className="btn btn-primary">비밀번호 변경</button>
        {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
      </form>
      
    </div>
  );
};

export default ChangePassword;
