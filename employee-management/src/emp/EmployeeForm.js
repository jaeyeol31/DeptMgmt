import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EmployeeService from '../services/EmployeeService';
import { departmentMap } from '../constants';

const EmployeeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState({
    ename: '',
    email: '',
    emailId: '',
    emailDomain: 'gmail.com',
    job: '',
    mgr: null,
    hiredate: new Date().toISOString().slice(0, 10),
    sal: '',
    comm: '',
    deptno: '',
    pwd: '1234',
    role: 'USER',
    phonePrefix: '010',
    phone2: '',
    phone3: '',
    address: ''
  });

  const [managerName, setManagerName] = useState('');
  const departments = Object.keys(departmentMap).map(deptno => ({
    deptno: parseInt(deptno),
    name: departmentMap[deptno].name
  }));

  const jobOptions = ['인턴', '사원', '대리', '과장', '차장', '부장', '이사', '사장'];
  const phoneOptions = ['010', '011', '016', '017', '018', '019'];
  const emailDomains = ['gmail.com', 'naver.com', 'daum.net', 'yahoo.com'];

  useEffect(() => {
    if (id) {
      EmployeeService.getEmployeeById(id).then((response) => {
        const phoneParts = response.data.phone ? response.data.phone.split('-') : ['', '', ''];
        const emailParts = response.data.email ? response.data.email.split('@') : ['', 'gmail.com'];
        setEmployee({
          ...response.data,
          emailId: emailParts[0],
          emailDomain: emailParts[1],
          phonePrefix: phoneParts[0],
          phone2: phoneParts[1],
          phone3: phoneParts[2],
        });
        if (response.data.deptno) {
          EmployeeService.getManagerByDept(response.data.deptno).then(manager => {
            if (manager) {
              setManagerName(manager.ename);
              setEmployee(prevState => ({
                ...prevState,
                mgr: manager.empno
              }));
            }
          });
        }
      });
    }
  }, [id]);

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
    if (name === 'phone2' || name === 'phone3') {
      if (/^\d{0,4}$/.test(value)) {
        setEmployee(prevState => ({
          ...prevState,
          [name]: value,
          phone: `${prevState.phonePrefix}-${prevState.phone2}-${prevState.phone3}`
        }));
      }
    } else {
      setEmployee(prevState => ({
        ...prevState,
        [name]: value,
        phone: `${value}-${prevState.phone2}-${prevState.phone3}`
      }));
    }
  };

  const handleDepartmentChange = (e) => {
    const selectedDeptno = parseInt(e.target.value);
    setEmployee({
      ...employee,
      deptno: selectedDeptno
    });

    EmployeeService.getManagerByDept(selectedDeptno).then(manager => {
      if (manager) {
        setManagerName(manager.ename);
        setEmployee(prevState => ({
          ...prevState,
          mgr: manager.empno
        }));
      } else {
        setManagerName('');
        setEmployee(prevState => ({
          ...prevState,
          mgr: null
        }));
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nameRegex = /^[a-zA-Z가-힣\s]+$/;
    if (!nameRegex.test(employee.ename)) {
      alert('이름은 영어와 한글만 입력할 수 있습니다.');
      return;
    }

    const phoneRegex = /^\d{4}$/;
    if (!phoneRegex.test(employee.phone2) || !phoneRegex.test(employee.phone3)) {
      alert('휴대폰 번호의 두 번째와 세 번째 부분은 각각 4자리 숫자여야 합니다.');
      return;
    }

    if (!employee.emailId || !employee.emailDomain) {
      alert('유효한 이메일 주소를 입력해주세요.');
      return;
    }

    if (!employee.job || !employee.deptno || !employee.sal || !employee.hiredate) {
      alert('모든 필수 필드를 입력해야 합니다.');
      return;
    }

    if (id) {
      EmployeeService.updateEmployee(id, employee).then(() => {
        navigate('/');
      });
    } else {
      EmployeeService.addEmployee(employee).then(() => {
        navigate('/');
      });
    }
  };

  return (
    <div>
      <h2>{id ? '직원 수정' : '직원 추가'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>이름</label>
          <input
            type="text"
            name="ename"
            value={employee.ename}
            onChange={handleChange}
            placeholder="이름 (영어 또는 한글)"
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>직급</label>
          <select
            name="job"
            value={employee.job}
            onChange={handleChange}
            className="form-control"
            required
          >
            <option value="">직급을 선택하세요</option>
            {jobOptions.map((job, index) => (
              <option key={index} value={job}>
                {job}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>휴대폰</label>
          <div className="d-flex">
            <select
              name="phonePrefix"
              value={employee.phonePrefix}
              onChange={handlePhoneChange}
              className="form-control"
              style={{ width: '25%' }}
              required
            >
              {phoneOptions.map((prefix, index) => (
                <option key={index} value={prefix}>
                  {prefix}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="phone2"
              value={employee.phone2}
              onChange={handlePhoneChange}
              placeholder="0000"
              className="form-control"
              style={{ width: '25%' }}
              required
            />
            <input
              type="text"
              name="phone3"
              value={employee.phone3}
              onChange={handlePhoneChange}
              placeholder="0000"
              className="form-control"
              style={{ width: '25%' }}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label>주소</label>
          <input
            type="text"
            name="address"
            value={employee.address}
            onChange={handleChange}
            placeholder="주소"
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>이메일</label>
          <div className="d-flex">
            <input
              type="text"
              name="emailId"
              value={employee.emailId}
              onChange={handleEmailChange}
              placeholder="아이디"
              className="form-control"
              style={{ width: '50%' }}
              required
            />
            <span className="align-self-center">@</span>
            <select
              name="emailDomain"
              value={employee.emailDomain}
              onChange={handleEmailChange}
              className="form-control"
              style={{ width: '50%' }}
              required
            >
              {emailDomains.map((domain, index) => (
                <option key={index} value={domain}>
                  {domain}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label>부서</label>
          <select
            name="deptno"
            value={employee.deptno}
            onChange={handleDepartmentChange}
            className="form-control"
            required
          >
            <option value="">부서를 선택하세요</option>
            {departments.map(dept => (
              <option key={dept.deptno} value={dept.deptno}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>매니저</label>
          <input
            type="text"
            name="mgrName"
            value={managerName}
            readOnly
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>입사일</label>
          <input
            type="date"
            name="hiredate"
            value={employee.hiredate}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>급여</label>
          <input
            type="number"
            name="sal"
            value={employee.sal}
            onChange={handleChange}
            placeholder="급여를 입력하세요"
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>커미션</label>
          <input
            type="number"
            name="comm"
            value={employee.comm}
            onChange={handleChange}
            placeholder="커미션을 입력하세요"
            className="form-control"
          />
        </div>
        {id && (
          <div className="form-group">
            <label>권한</label>
            <input
              type="text"
              name="role"
              value={employee.role}
              readOnly
              className="form-control"
            />
          </div>
        )}
        <button type="submit" className="btn btn-primary">저장</button>
      </form>
    </div>
  );
};

export default EmployeeForm;
