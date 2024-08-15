import React, { useState, useEffect } from 'react';
import NoticeService from '../services/NoticeService';
import { useNavigate, useParams } from 'react-router-dom';

const NoticeForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [attachment, setAttachment] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams(); // URL에서 ID를 가져옵니다.

  useEffect(() => {
    if (id) {
      NoticeService.getNoticeById(id).then(response => {
        const notice = response.data;
        setTitle(notice.title);
        setContent(notice.content);
        // 섬네일과 첨부파일은 파일 입력이므로 일반적으로 미리 채우지 않고
        // 사용자가 필요 시 재업로드할 수 있도록 둡니다.
      });
    }
  }, [id]);

  const handleThumbnailChange = (e) => {
    setThumbnail(e.target.files[0]);
  };

  const handleAttachmentChange = (e) => {
    setAttachment(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (thumbnail) formData.append('thumbnail', thumbnail);
    if (attachment) formData.append('attachment', attachment);

    if (id) {
      NoticeService.updateNotice(id, formData).then(() => {
        navigate('/notices');
      });
    } else {
      NoticeService.createNotice(formData).then(() => {
        navigate('/notices');
      });
    }
  };

  return (
    <div>
      <h2>{id ? '공지사항 수정' : '공지사항 작성'}</h2>
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
        <div className="form-group">
          <label>섬네일 이미지</label>
          <input type="file" className="form-control" onChange={handleThumbnailChange} />
        </div>
        <div className="form-group">
          <label>파일 첨부</label>
          <input type="file" className="form-control" onChange={handleAttachmentChange} />
        </div>
        <button type="submit" className="btn btn-primary">{id ? '수정' : '작성'}</button>
      </form>
    </div>
  );
};

export default NoticeForm;
