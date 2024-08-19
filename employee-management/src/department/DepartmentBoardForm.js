import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const DepartmentBoardForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { id } = useParams(); // 수정할 게시글의 ID
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      axios.get(`/api/department-board/${id}`)
        .then(response => {
          const post = response.data;
          setTitle(post.title);
          setContent(post.content);
        })
        .catch(error => {
          console.error('There was an error fetching the post!', error);
        });
    }
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const postData = { title, content };

    if (id) {
      axios.put(`/api/department-board/${id}`, postData)
        .then(() => {
          navigate(`/department-board/${id}`);
        })
        .catch(error => {
          console.error('There was an error updating the post!', error);
        });
    } else {
      axios.post('/api/department-board', postData)
        .then(() => {
          navigate('/department-board');
        })
        .catch(error => {
          console.error('There was an error creating the post!', error);
        });
    }
  };

  return (
    <div>
      <h2>{id ? '글 수정' : '글 작성'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>제목</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>내용</label>
          <textarea
            className="form-control"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">{id ? '수정' : '작성'}</button>
      </form>
    </div>
  );
};

export default DepartmentBoardForm;
