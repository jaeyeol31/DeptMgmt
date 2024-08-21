import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const DepartmentBoardForm = () => {
  const [title, setTitle] = useState(''); // 빈 문자열로 초기화
  const [content, setContent] = useState(''); // 빈 문자열로 초기화
  const [author, setAuthor] = useState(''); // 빈 문자열로 초기화
  const [deptName, setDeptName] = useState(''); // 빈 문자열로 초기화
  const [deptNo, setDeptNo] = useState(null); // 부서 번호를 저장할 상태 추가
  const { id } = useParams(); // 수정할 게시글의 ID
  const navigate = useNavigate();

  useEffect(() => {
    const empNo = sessionStorage.getItem('empno');
    console.log('Session empNo:', empNo); // empNo가 세션에서 올바르게 가져와지는지 확인

    if (empNo) {
      axios.get(`/api/employees/${empNo}`)
        .then(response => {
          const employee = response.data;
          console.log('Fetched employee:', employee); // 직원 정보가 올바르게 가져와지는지 확인
          setAuthor(employee.ename);
          setDeptName(employee.deptName);
          setDeptNo(employee.deptno); // 부서 번호 설정
        })
        .catch(error => {
          console.error('직원 정보를 불러오는 중 오류가 발생했습니다!', error);
        });
    }

    if (id) {
      axios.get(`/api/department-board/${id}`)
        .then(response => {
          const post = response.data;
          console.log('Fetched post:', post); // 게시글 정보가 올바르게 가져와지는지 확인
          setTitle(post.title);
          setContent(post.content);
        })
        .catch(error => {
          console.error('게시글 정보를 불러오는 중 오류가 발생했습니다!', error);
        });
    }
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const empNo = sessionStorage.getItem('empno');
    if (!empNo || !deptNo || !author) {
      console.error('세션에서 필요한 정보를 가져오지 못했습니다.');
      return;
    }

    const postData = {
      title,
      content,
      empNo,   // 사원 번호 추가
      author,  // 작성자 이름 추가
      deptNo   // 부서 번호 추가
    };

    console.log('Submitting post data:', postData); // 제출할 데이터 확인

    if (id) {
      axios.put(`/api/department-board/${id}`, postData)
        .then(() => {
          console.log('Post updated successfully'); // 성공 메시지 출력
          navigate(`/department-board/${id}`);
        })
        .catch(error => {
          console.error('게시글 수정 중 오류가 발생했습니다!', error);
        });
    } else {
      axios.post('/api/department-board', postData)
        .then(() => {
          console.log('Post created successfully'); // 성공 메시지 출력
          navigate('/department-board');
        })
        .catch(error => {
          console.error('게시글 작성 중 오류가 발생했습니다!', error);
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
            onChange={(e) => {
              console.log('Title changed:', e.target.value); // 제목 변경 로그
              setTitle(e.target.value);
            }}
            required
          />
        </div>
        <div className="form-group">
          <label>내용</label>
          <textarea
            className="form-control"
            value={content}
            onChange={(e) => {
              console.log('Content changed:', e.target.value); // 내용 변경 로그
              setContent(e.target.value);
            }}
            required
          />
        </div>
        <div className="form-group">
          <label>작성자</label>
          <input
            type="text"
            className="form-control"
            value={author}
            readOnly
          />
        </div>
        <div className="form-group">
          <label>작성 부서</label>
          <input
            type="text"
            className="form-control"
            value={deptName}
            readOnly
          />
        </div>
        <button type="submit" className="btn btn-primary">{id ? '수정' : '작성'}</button>
      </form>
    </div>
  );
};

export default DepartmentBoardForm;
