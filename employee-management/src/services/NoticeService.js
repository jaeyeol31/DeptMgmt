import axios from 'axios';

const NOTICE_API_BASE_URL = "http://localhost:8080/api/notices";

class NoticeService {
	createNotice(notice) {
		return axios.post(`${NOTICE_API_BASE_URL}/upload`, notice, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		});
	}
	
	getAllNotices() {
		return axios.get(NOTICE_API_BASE_URL);
	}

	getNoticeById(id) {
		return axios.get(`${NOTICE_API_BASE_URL}/${id}`);
	}

	addNotice(notice) {
		return axios.post(NOTICE_API_BASE_URL, notice);
	}

	updateNotice(id, notice) {
		return axios.put(`${NOTICE_API_BASE_URL}/${id}`, notice);
	}

	deleteNotice(id) {
		return axios.delete(`${NOTICE_API_BASE_URL}/${id}`);
	}
	getNoticeById(id) {
		return axios.get(`${NOTICE_API_BASE_URL}/${id}`);
	}
}

export default new NoticeService();
