import React, { useEffect, useState } from 'react';
import EmployeeService from '../services/EmployeeService';

const MyPage = () => {
  const [employee, setEmployee] = useState({
    empno: '',
    ename: '',
    email: '',
    emailId: '',
    emailDomain: 'gmail.com',
    job: '',
    phone: '',
    address: '',
    deptno: '',
    sal: '',
    mgr: '',
    hiredate: ''
  });

  const [editField, setEditField] = useState('');

  useEffect(() => {
    const empno = sessionStorage.getItem('empno');
    
    if (empno) {
      EmployeeService.getEmployeeById(empno).then((response) => {
        const employeeData = response.data;
        const phoneParts = employeeData.phone ? employeeData.phone.split('-') : ['', '', ''];
        const emailParts = employeeData.email ? employeeData.email.split('@') : ['', ''];

        setEmployee({
          ...employeeData,
          phonePrefix: phoneParts[0] || '010',
          phone2: phoneParts[1] || '',
          phone3: phoneParts[2] || '',
          emailId: emailParts[0] || '',
          emailDomain: emailParts[1] || 'gmail.com'
        });
      });
    }
  }, []);

  const handleEditClick = (field) => {
    if (editField === field) {
      EmployeeService.updateEmployee(employee.empno, employee).then(() => {
        setEditField('');
      });
    } else {
      setEditField(field);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleEmailChange = (e) => {
    const { name, value } = e.target;
    setEmployee(prevState => ({
      ...prevState,
      [name]: value,
      email: `${prevState.emailId}@${prevState.emailDomain}`
    }));
  };

  const handlePhoneChange = (e) => {
    const { name, value } = e.target;
    setEmployee(prevState => ({
      ...prevState,
      [name]: value,
      phone: `${prevState.phonePrefix}-${prevState.phone2}-${prevState.phone3}`
    }));
  };

  const formStyle = {
    maxWidth: '600px',  // 폼의 최대 너비 조정
    margin: '0 auto',   // 폼을 화면 중앙에 배치
    padding: '20px',    // 폼 내부 패딩
    border: '1px solid #ccc',  // 폼 테두리
    borderRadius: '10px',  // 폼 모서리 둥글게
    backgroundColor: '#f9f9f9', // 폼 배경색
  };

  const rowStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '10px',
  };

  const inputContainerStyle = {
    flex: '1',
    display: 'flex',
    alignItems: 'center',
  };

  const inputStyle = {
    flex: '1',
    marginRight: '10px',
  };

  const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'flex-end',  // 버튼을 오른쪽으로 정렬
  };

  return (
    <div style={formStyle}>
      <h2>마이페이지</h2>
      <table className="table table-bordered">
        <tbody>
          <tr>
            <th>아이디</th>
            <td>{employee.empno}</td>
          </tr>
          <tr>
            <th>이름</th>
            <td>{employee.ename}</td>
          </tr>
          <tr>
            <th>직급</th>
            <td>{employee.job}</td>
          </tr>
          <tr>
            <th>이메일</th>
            <td>
              <div style={rowStyle}>
                {editField === 'email' ? (
                  <div style={inputContainerStyle}>
                    <input
                      type="text"
                      name="emailId"
                      value={employee.emailId || ''}
                      onChange={handleEmailChange}
                      className="form-control"
                    />
                    <span className="align-self-center">@</span>
                    <select
                      name="emailDomain"
                      value={employee.emailDomain}
                      onChange={handleEmailChange}
                      className="form-control"
                    >
                      <option value="gmail.com">gmail.com</option>
                      <option value="naver.com">naver.com</option>
                      <option value="daum.net">daum.net</option>
                      <option value="yahoo.com">yahoo.com</option>
                    </select>
                  </div>
                ) : (
                  employee.email
                )}
                <div style={buttonContainerStyle}>
                  <button onClick={() => handleEditClick('email')}>
                    {editField === 'email' ? '저장' : '수정'}
                  </button>
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <th>휴대폰</th>
            <td>
              <div style={rowStyle}>
                {editField === 'phone' ? (
                  <div style={inputContainerStyle}>
                    <select
                      name="phonePrefix"
                      value={employee.phonePrefix || '010'}
                      onChange={handlePhoneChange}
                      className="form-control"
                    >
                      <option value="010">010</option>
                      <option value="011">011</option>
                      <option value="016">016</option>
                      <option value="017">017</option>
                      <option value="018">018</option>
                      <option value="019">019</option>
                    </select>
                    <input
                      type="text"
                      name="phone2"
                      value={employee.phone2 || ''}
                      onChange={handlePhoneChange}
                      className="form-control"
                      placeholder="0000"
                    />
                    <input
                      type="text"
                      name="phone3"
                      value={employee.phone3 || ''}
                      onChange={handlePhoneChange}
                      className="form-control"
                      placeholder="0000"
                    />
                  </div>
                ) : (
                  employee.phone
                )}
                <div style={buttonContainerStyle}>
                  <button onClick={() => handleEditClick('phone')}>
                    {editField === 'phone' ? '저장' : '수정'}
                  </button>
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <th>주소</th>
            <td>
              <div style={rowStyle}>
                {editField === 'address' ? (
                  <div style={inputContainerStyle}>
                    <input
                      type="text"
                      name="address"
                      value={employee.address || ''}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                ) : (
                  employee.address
                )}
                <div style={buttonContainerStyle}>
                  <button onClick={() => handleEditClick('address')}>
                    {editField === 'address' ? '저장' : '수정'}
                  </button>
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <th>부서</th>
            <td>{employee.deptno}</td>
          </tr>
          <tr>
            <th>급여</th>
            <td>{employee.sal}</td>
          </tr>
          <tr>
            <th>담당 매니저</th>
            <td>{employee.mgr}</td>
          </tr>
          <tr>
            <th>입사일</th>
            <td>{employee.hiredate}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default MyPage;
