import React from 'react';

const Home = () => {
  return (
    <div>
      {/* 배너 */}
      <div style={styles.banner}>
        <h1>환영합니다!</h1>
        <p>우리 회사의 최신 소식을 확인하세요.</p>
      </div>

      {/* 사내 공지사항 및 부서 게시판 */}
      <div style={styles.contentContainer}>
        <div style={styles.noticeBoard}>
          <h2>사내 공지사항</h2>
          <ul>
            <li>2024년 휴가 일정 안내</li>
            <li>사내 보안 교육 필수 이수</li>
            <li>신규 프로젝트 설명회</li>
          </ul>
        </div>
        <div style={styles.departmentBoard}>
          <h2>부서 게시판</h2>
          <ul>
            <li>마케팅팀 워크샵 일정</li>
            <li>개발팀 코드 리뷰 일정</li>
            <li>인사팀 신규 채용 안내</li>
          </ul>
        </div>
      </div>

      {/* 푸터 */}
      <footer style={styles.footer}>
        <p>회사명: woduf Corp | 주소: 서울특별시 강남구 테헤란로 123</p>
        <p>전화번호: 02-123-4567 | 이메일: woduf31@gmail.com</p>
        <p>&copy; 2024 woduf Corp. All rights reserved.</p>
      </footer>
    </div>
  );
};

const styles = {
  banner: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '50px',
    textAlign: 'center',
  },
  contentContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '20px',
    margin: '20px 0',
  },
  noticeBoard: {
    flex: 1,
    marginRight: '10px',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '10px',
    backgroundColor: '#f9f9f9',
  },
  departmentBoard: {
    flex: 1,
    marginLeft: '10px',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '10px',
    backgroundColor: '#f9f9f9',
  },
  footer: {
    backgroundColor: '#333',
    color: 'white',
    textAlign: 'center',
    padding: '20px',
    marginTop: '20px',
  },
};

export default Home;
