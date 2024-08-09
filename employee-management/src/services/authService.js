import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/auth';

const login = async (empno, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, {
      empno,
      password,
    }, {
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    throw new Error('로그인 실패: 아이디 또는 비밀번호를 확인하세요.');
  }
};

const logout = async () => {
  try {
    await axios.post(`${API_BASE_URL}/logout`, {}, { withCredentials: true });
    sessionStorage.removeItem('empno');
    window.location.href = '/'; // 로그아웃 후 홈 화면으로 리다이렉트
  } catch (error) {
    console.error('로그아웃 실패:', error);
  }
};

const authService = {
  login,
  logout,
};

export default authService;
