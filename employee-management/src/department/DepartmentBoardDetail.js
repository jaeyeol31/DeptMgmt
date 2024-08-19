import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';

const DepartmentBoardDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/department-board/${id}`)
      .then(response => {
        setPost(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the post!', error);
      });
  }, [id]);

  const handleEditClick = () => {
    navigate(`/department-board/edit/${id}`);
  };

  const handleDeleteClick = () => {
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      axios.delete(`/api/department-board/${id}`)
        .then(() => {
          alert('게시글이 삭제되었습니다.');
          navigate('/department-board');
        })
        .catch(error => {
          console.error('There was an error deleting the post!', error);
        });
    }
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{post.title}</h2>
      <p>작성자: {post.author}</p>
      <p>작성일: {new Date(post.createdAt).toLocaleDateString()}</p>
      <hr />
      <p>{post.content}</p>
      <Link to="/department-board" className="btn btn-primary">목록으로 돌아가기</Link>
      <button onClick={handleEditClick} className="btn btn-warning">수정</button>
      <button onClick={handleDeleteClick} className="btn btn-danger" style={{ marginLeft: '10px' }}>삭제</button>
    </div>
  );
};

export default DepartmentBoardDetail;
