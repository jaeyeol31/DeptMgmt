import React, { useState, useEffect } from 'react';
import NoticeService from '../services/NoticeService';
import { useNavigate, useParams } from 'react-router-dom';

const categoryDescriptions = {
  HR: '인사 관련 공지사항: 채용 공고, 승진/인사 이동, 신규 입사자 안내, 퇴사자 공지, 교육 및 연수 프로그램 안내, 복리후생 정책 업데이트, 연차 및 휴가 일정 안내, 건강검진 안내, 보험 및 연금 안내',
  IT_SECURITY: '보안 및 IT 및 규정 및 정책 관련: 보안 정책 업데이트, 시스템 점검 및 유지보수 안내, 비밀번호 변경 요청, IT 교육 및 세미나, 회사 규정 변경 안내, 신규 정책 도입 공지, 법적 준수 사항 안내, 윤리 및 행동강령 안내',
  PROJECT_WORK: '프로젝트 및 업무 관련: 프로젝트 출시/완료 공지, 업무 프로세스 변경, 부서별 목표 및 성과 공지, 협업 및 회의 일정 안내',
  COMPANY_NEWS: '사내 소식 및 행사 및 이벤트: 회사 소식 및 뉴스레터, 직원 성과 및 공로 소개, 부서별 소식 및 활동 보고, 고객사/협력사 소식 공유, 사내 행사 및 이벤트 안내, 워크숍 및 세미나 일정, 연말/신년 파티 안내, 체육대회 및 팀 빌딩 행사',
  URGENT: '긴급 공지사항: 비상 상황 안내, 자연재해 대비 및 안전 지침, 긴급 회의 소집 공지, 예상치 못한 사안 발생 시 조치 안내',
};

const subcategoryOptions = {
  HR: [
    '채용 공고',
    '승진/인사 이동',
    '신규 입사자 안내',
    '퇴사자 공지',
    '교육 및 연수 프로그램 안내',
    '복리후생 정책 업데이트',
    '연차 및 휴가 일정 안내',
    '건강검진 안내',
    '보험 및 연금 안내',
  ],
  IT_SECURITY: [
    '보안 정책 업데이트',
    '시스템 점검 및 유지보수 안내',
    '비밀번호 변경 요청',
    'IT 교육 및 세미나',
    '회사 규정 변경 안내',
    '신규 정책 도입 공지',
    '법적 준수 사항 안내',
    '윤리 및 행동강령 안내',
  ],
  PROJECT_WORK: [
    '프로젝트 출시/완료 공지',
    '업무 프로세스 변경',
    '부서별 목표 및 성과 공지',
    '협업 및 회의 일정 안내',
  ],
  COMPANY_NEWS: [
    '회사 소식 및 뉴스레터',
    '직원 성과 및 공로 소개',
    '부서별 소식 및 활동 보고',
    '고객사/협력사 소식 공유',
    '사내 행사 및 이벤트 안내',
    '워크숍 및 세미나 일정',
    '연말/신년 파티 안내',
    '체육대회 및 팀 빌딩 행사',
  ],
  URGENT: [
    '비상 상황 안내',
    '자연재해 대비 및 안전 지침',
    '긴급 회의 소집 공지',
    '예상치 못한 사안 발생 시 조치 안내',
  ],
};

const NoticeForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('HR');
  const [subcategory, setSubcategory] = useState(subcategoryOptions['HR'][0]);
  const [thumbnail, setThumbnail] = useState(null);
  const [attachment, setAttachment] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams(); 

  useEffect(() => {
    if (id) {
      NoticeService.getNoticeById(id).then(response => {
        const notice = response.data;
        setTitle(notice.title || '');
        setContent(notice.content || '');
        setCategory(notice.category || 'HR');
        setSubcategory(notice.subcategory || subcategoryOptions[notice.category || 'HR'][0]);
      });
    }
  }, [id]);

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);
    setSubcategory(subcategoryOptions[selectedCategory][0]);
  };

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
    formData.append('category', category);  // 카테고리 업데이트
    formData.append('subcategory', subcategory);  // 서브카테고리 업데이트
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
          <label>카테고리</label>
          <select
            className="form-control"
            value={category}
            onChange={handleCategoryChange}
            required
          >
            <option value="HR">인사 관련 공지사항</option>
            <option value="IT_SECURITY">보안 및 IT 및 규정 및 정책 관련</option>
            <option value="PROJECT_WORK">프로젝트 및 업무 관련</option>
            <option value="COMPANY_NEWS">사내 소식 및 행사 및 이벤트</option>
            <option value="URGENT">긴급 공지사항</option>
          </select>
          <small className="form-text text-muted">{categoryDescriptions[category]}</small>
        </div>
        <div className="form-group">
          <label>세부 카테고리</label>
          <select
            className="form-control"
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
            required
          >
            {subcategoryOptions[category].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
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
