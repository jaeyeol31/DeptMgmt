import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const DepartmentBoardList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get('/api/department-board')
      .then(response => {
        setPosts(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the posts!', error);
      });
  }, []);

  return (
    <div>
      <h2>부서 게시판</h2>
      <Link to="/department-board/create" className="btn btn-primary mb-3">글 작성</Link>
      <table className="table">
        <thead>
          <tr>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일</th>
          </tr>
        </thead>
        <tbody>
          {posts.map(post => (
            <tr key={post.id}>
              <td>
                <Link to={`/department-board/${post.id}`}>{post.title}</Link>
              </td>
              <td>{post.author}</td>
              <td>{new Date(post.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DepartmentBoardList;
