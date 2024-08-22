import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { departmentMap } from '../constants';

const DepartmentBoard = () => {
  const [departmentPosts, setDepartmentPosts] = useState([]);
  const [selectedDept, setSelectedDept] = useState('10');

  useEffect(() => {
    if (selectedDept !== 'ALL') {
      fetchDepartmentPosts(selectedDept);
    }
  }, [selectedDept]);

  const fetchDepartmentPosts = (deptNo) => {
    axios
      .get(`/api/department-board/dept/${deptNo}/recent?limit=5`)
      .then((response) => {
        setDepartmentPosts(response.data);
      })
      .catch((error) => {
        console.error(
          '부서 게시판 데이터를 불러오는 중 오류가 발생했습니다!',
          error
        );
      });
  };

  const handleDepartmentClick = (deptNo) => {
    setSelectedDept(deptNo);
  };

  return (
    <div style={styles.departmentBoard}>
      <h2 className="mb-3">부서 게시판</h2>
      <div className="mb-4">
        <div
          className="btn-group"
          role="group"
          aria-label="Department Selector"
        >
          {Object.entries(departmentMap).map(([deptNo, { name }]) => (
            <button
              key={deptNo}
              type="button"
              className={`btn ${
                selectedDept === deptNo ? 'btn-primary' : 'btn-outline-primary'
              }`}
              onClick={() => handleDepartmentClick(deptNo)}
            >
              {name}
            </button>
          ))}
        </div>
      </div>
      {selectedDept !== 'ALL' && departmentPosts.length > 0 && (
        <table className="table table-bordered" style={styles.table}>
          <thead>
            <tr>
              <th>게시판 제목</th>
              <th>작성일</th>
            </tr>
          </thead>
          <tbody>
            {departmentPosts.map((post) => (
              <tr key={post.id}>
                <td>
                  <a
                    href={`/department-board/${post.id}`}
                    className="text-decoration-none"
                  >
                    {post.title}
                  </a>
                </td>
                <td>{new Date(post.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {selectedDept !== 'ALL' && departmentPosts.length === 0 && (
        <p>해당 부서에 게시글이 없습니다.</p>
      )}
    </div>
  );
};

const styles = {
  departmentBoard: {
    marginBottom: '20px',
  },
  table: {
    marginTop: '20px',
  },
  btnGroup: {
    marginRight: '5px',
  },
  btnPrimary: {
    backgroundColor: '#007bff',
  },
  btnOutlinePrimary: {
    borderColor: '#007bff',
    color: '#007bff',
  },
};

export default DepartmentBoard;
