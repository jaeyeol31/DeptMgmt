import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Comments = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editCommentId, setEditCommentId] = useState(null); // 수정 중인 댓글 ID
  const [editCommentContent, setEditCommentContent] = useState(''); // 수정 중인 댓글 내용
  const loggedInEmpNo = sessionStorage.getItem('empno') || '0'; // 현재 로그인된 사용자 번호

  useEffect(() => {
    axios.get(`/api/department-board/${postId}/comments`)
      .then(response => {
        setComments(response.data);
      })
      .catch(error => {
        console.error('댓글을 불러오는 중 오류가 발생했습니다!', error);
      });
  }, [postId]);

  const handleAddComment = () => {
    if (newComment.trim() === '') return;

    axios.post(`/api/department-board/${postId}/comments`, { content: newComment })
      .then(response => {
        setComments([...comments, response.data]);
        setNewComment('');
      })
      .catch(error => {
        console.error('댓글 작성 중 오류가 발생했습니다!', error);
      });
  };

  const handleDeleteComment = (commentId) => {
    if (window.confirm('이 댓글을 삭제하시겠습니까?')) {
      axios.delete(`/api/department-board/${postId}/comments/${commentId}`)
        .then(() => {
          setComments(comments.filter(comment => comment.id !== commentId));
        })
        .catch(error => {
          console.error('댓글 삭제 중 오류가 발생했습니다!', error);
        });
    }
  };

  const handleEditComment = (commentId, currentContent) => {
    setEditCommentId(commentId);
    setEditCommentContent(currentContent);
  };

  const handleUpdateComment = () => {
    if (editCommentContent.trim() === '') return;

    axios.put(`/api/department-board/${postId}/comments/${editCommentId}`, { content: editCommentContent })
      .then(response => {
        setComments(comments.map(comment => 
          comment.id === editCommentId ? response.data : comment
        ));
        setEditCommentId(null);
        setEditCommentContent('');
      })
      .catch(error => {
        console.error('댓글 수정 중 오류가 발생했습니다!', error);
      });
  };

  return (
    <div className="comments-section mt-4">
      <h4>댓글</h4>
      <div className="comments-list mb-4">
        {comments.length === 0 ? (
          <p className="text-muted">댓글이 없습니다. 첫 번째 댓글을 남겨보세요!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment-item p-2 mb-2 border rounded">
              {editCommentId === comment.id ? (
                <div>
                  <textarea
                    className="form-control mb-2"
                    value={editCommentContent}
                    onChange={(e) => setEditCommentContent(e.target.value)}
                  />
                  <button className="btn btn-primary btn-sm" onClick={handleUpdateComment}>수정 완료</button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setEditCommentId(null)}
                    style={{ marginLeft: '10px' }}
                  >
                    취소
                  </button>
                </div>
              ) : (
                <div>
                  <p className="mb-1">{comment.content}</p>
                  <small className="text-muted">작성자: {comment.author || '익명'}</small>
                  {parseInt(loggedInEmpNo) === comment.empNo && (
                    <div>
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => handleEditComment(comment.id, comment.content)}
                        style={{ marginRight: '5px', marginTop: '10px' }}
                      >
                        수정
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteComment(comment.id)}
                        style={{ marginTop: '10px' }}
                      >
                        삭제
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="comment-form">
        <textarea
          className="form-control mb-2"
          rows="3"
          placeholder="댓글을 작성하세요..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleAddComment}>
          댓글 작성
        </button>
      </div>
    </div>
  );
};

export default Comments;
