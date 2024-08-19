import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const DepartmentBoardList = () => {
  const [posts, setPosts] = useState([]);
  const [departments, setDepartments] = useState([]); // 부서 목록
  const [selectedDept, setSelectedDept] = useState(null); // 선택된 부서
  const [deptMap, setDeptMap] = useState({}); // 부서번호와 부서명을 매핑하는 객체
  const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태

  useEffect(() => {
    axios.get('/api/depts') // 모든 부서 정보를 가져옴
      .then(response => {
        setDepartments(response.data);
        const map = {};
        response.data.forEach(dept => {
          map[dept.deptno] = dept.dname; // 부서번호와 부서명 매핑
        });
        setDeptMap(map);
      })
      .catch(error => {
        console.error('There was an error fetching the departments!', error);
      });

    fetchPosts(); // 초기에는 전체 게시글을 가져옴
  }, []);

  const fetchPosts = (deptNo = null) => {
    const url = deptNo ? `/api/department-board/department/${deptNo}` : '/api/department-board';
    axios.get(url)
      .then(response => {
        const sortedPosts = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // 작성일자 순으로 정렬
        setPosts(sortedPosts);
      })
      .catch(error => {
        console.error('There was an error fetching the posts!', error);
      });
  };

  const handleDeptChange = (e) => {
    const deptNo = e.target.value;
    setSelectedDept(deptNo);
    fetchPosts(deptNo);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // 검색어에 맞는 게시글만 필터링
  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deptMap[post.deptNo]?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2>부서 게시판</h2>

      <div className="mb-3">
        <label htmlFor="departmentSelect">부서 선택:</label>
        <select
          id="departmentSelect"
          className="form-control"
          value={selectedDept || ''}
          onChange={handleDeptChange}
        >
          <option value="">전체</option>
          {departments.map(dept => (
            <option key={dept.deptno} value={dept.deptno}>
              {dept.dname}
            </option>
          ))}
        </select>
      </div>

      <input 
        type="text" 
        placeholder="검색어를 입력하세요" 
        className="form-control mb-3"
        value={searchTerm} 
        onChange={handleSearchChange} 
      />

      <Link to="/department-board/create" className="btn btn-primary mb-3">글 작성</Link>
      <table className="table">
        <thead>
          <tr><th>제목</th><th>작성자</th><th>부서명</th><th>작성일</th></tr>
        </thead>
        <tbody>
          {filteredPosts.map(post => (
            <tr key={post.id}>
              <td><Link to={`/department-board/${post.id}`}>{post.title}</Link></td>
              <td>{post.author}</td>
              <td>{deptMap[post.deptNo]}</td>
              <td>{new Date(post.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DepartmentBoardList;
