export const departmentMap = {
  10: { name: 'HR', managerDeptNo: 11 },
  11: { name: 'HR', managerDeptNo: 11 },
  20: { name: 'Finance', managerDeptNo: 21 },
  21: { name: 'Finance', managerDeptNo: 21 },
  30: { name: 'Engineering', managerDeptNo: 31 },
  31: { name: 'Engineering', managerDeptNo: 31 },
  40: { name: 'Marketing', managerDeptNo: 41 },
  41: { name: 'Marketing', managerDeptNo: 41 },
  50: { name: 'Sales', managerDeptNo: 51 },
  51: { name: 'Sales', managerDeptNo: 51 },
  60: { name: 'Support', managerDeptNo: 61 },
  61: { name: 'Support', managerDeptNo: 61 },
  70: { name: 'Legal', managerDeptNo: 71 },
  71: { name: 'Legal', managerDeptNo: 71 },
  80: { name: 'IT', managerDeptNo: 81 },
  81: { name: 'IT', managerDeptNo: 81 },
  90: { name: 'R&D', managerDeptNo: 91 },
  91: { name: 'R&D', managerDeptNo: 91 },
  100: { name: 'Logistics', managerDeptNo: 101 },
  101: { name: 'Logistics', managerDeptNo: 101 },
};

export const getDepartmentName = (deptno) => {
  const department = departmentMap[deptno];
  return department ? department.name : 'Unknown';
};

export const getManagerDeptNo = (deptno) => {
  const department = departmentMap[deptno];
  return department ? department.managerDeptNo : null;
};
