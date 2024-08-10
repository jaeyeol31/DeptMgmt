export const departmentMap = {
  10: { name: 'Accounting', managerDeptNo: 10 },
  20: { name: 'Research', managerDeptNo: 20 },
  30: { name: 'Sales', managerDeptNo: 30 },
  40: { name: 'Operations', managerDeptNo: 40 },
  50: { name: 'Finance', managerDeptNo: 50 },
  60: { name: 'Marketing', managerDeptNo: 60 },
  70: { name: 'HR', managerDeptNo: 70 },
  80: { name: 'IT', managerDeptNo: 80 },
  90: { name: 'Legal', managerDeptNo: 90 },
  100: { name: 'Retail', managerDeptNo: 100 },
};

export const getDepartmentName = (deptno) => {
  const department = departmentMap[deptno];
  return department ? department.name : 'Unknown';
};

export const getManagerDeptNo = (deptno) => {
  const department = departmentMap[deptno];
  return department ? department.managerDeptNo : null;
};
