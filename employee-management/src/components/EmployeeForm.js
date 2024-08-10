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
    job: '',
    mgr: null,
    hiredate: '',
    sal: '',
    comm: '',
    deptno: '',
    pwd: '1234',
    role: 'USER'
  });

  const [managerName, setManagerName] = useState('');
  const departments = Object.keys(departmentMap).map(deptno => ({
    deptno: parseInt(deptno),
    name: departmentMap[deptno].name
  }));

  const jobOptions = ['인턴', '사원', '대리', '과장', '차장', '부장', '이사', '사장'];

  useEffect(() => {
    if (id) {
      EmployeeService.getEmployeeById(id).then((response) => {
        setEmployee(response.data);
        if (response.data.deptno) {
          // 매니저 정보 가져오기
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

    if (name === 'job') {
      const newRole = ['부장', '이사', '사장'].includes(value) ? 'Department Manager' : 'USER';
      setEmployee(prevState => ({
        ...prevState,
        [name]: value,
        role: newRole
      }));
    } else {
      setEmployee(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleDepartmentChange = (e) => {
    const selectedDeptno = parseInt(e.target.value);
    setEmployee({
      ...employee,
      deptno: selectedDeptno
    });

    // 부서 선택 시 매니저 정보 가져오기
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
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>이메일</label>
          <input
            type="email"
            name="email"
            value={employee.email}
            onChange={handleChange}
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
            {jobOptions.map(job => (
              <option key={job} value={job}>
                {job}
              </option>
            ))}
          </select>
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
