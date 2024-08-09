import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EmployeeService from '../services/EmployeeService';
import { departmentMap, getManagerDeptNo } from '../constants';

const EmployeeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState({
    ename: '',
    job: '',
    mgr: null,
    hiredate: '',
    sal: '',
    comm: '',
    deptno: ''
  });
  const [managerName, setManagerName] = useState('');
  const departments = Object.keys(departmentMap).map(deptno => ({
    deptno: parseInt(deptno),
    name: departmentMap[deptno].name
  }));

  useEffect(() => {
    if (id) {
      EmployeeService.getEmployeeById(id).then((response) => {
        setEmployee(response.data);
        const managerDeptNo = getManagerDeptNo(response.data.deptno);
        if (managerDeptNo) {
          EmployeeService.getManagerName(managerDeptNo).then(name => setManagerName(name));
        }
      });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee({ ...employee, [name]: value });
  };

  const handleDepartmentChange = (e) => {
    const selectedDeptno = parseInt(e.target.value);
    const mgrDeptNo = getManagerDeptNo(selectedDeptno);
    setEmployee({
      ...employee,
      deptno: selectedDeptno,
      mgr: mgrDeptNo
    });
    if (mgrDeptNo) {
      EmployeeService.getManagerName(mgrDeptNo).then(name => setManagerName(name));
    } else {
      setManagerName('');
    }
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
          <label>비밀번호</label>
          <input
            type="text"
            name="passWord"
            value={employee.passWord}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>직업</label>
          <input
            type="text"
            name="job"
            value={employee.job}
            onChange={handleChange}
            className="form-control"
            required
          />
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
        <div className="form-group">
          <label>권한</label>
          <select
            name="role"
            value={employee.role}
            onChange={handleChange}
            className="form-control"
            required
          >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">저장</button>
      </form>
    </div>
  );
};

export default EmployeeForm;
