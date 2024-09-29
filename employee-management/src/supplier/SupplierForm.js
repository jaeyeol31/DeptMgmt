import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function SupplierForm() {
	const { id } = useParams(); // URL에서 id를 가져옴 (수정 시 사용)
	const navigate = useNavigate();
	const [businessNumber, setBusinessNumber] = useState('');
	const [error, setError] = useState(null);
	const [formData, setFormData] = useState({
		supplierCode: '',
		name: '',
		businessRegistrationNumber: '',
		taxpayerStatus: '',
		taxpayerStatusCode: '',
		taxType: '',
		taxTypeCode: '',
		closureDate: '',
		utccYn: '',
		recentTaxTypeChangeDate: '',
		invoiceApplyDate: '',
		previousTaxType: '',
		previousTaxTypeCode: '',
		representativeName: '',
		businessType: '',
		businessItem: '',
		address: '',
		contactNumber: '',
		faxNumber: '',
		managerInfo: '',
		bankInfo: '',
		supplierType: '3',
		createdAt: '',
		updatedAt: '',
	});

	// 수정 시 기존 데이터를 불러오는 useEffect
	useEffect(() => {
		if (id) {
			// 수정 시 기존 데이터를 가져와서 formData에 설정
			axios.get(`/api/supplier/${id}`)
				.then(response => {
					setFormData(response.data);
				})
				.catch(error => {
					setError('거래처 정보를 불러오는 중 오류가 발생했습니다.');
					console.error(error);
				});
		}
	}, [id]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (id) {
				// 거래처 수정
				const updatedData = {
					...formData,
					updatedAt: new Date().toISOString(), // 수정일은 현재 시간으로 자동 설정
				};

				const response = await axios.put(`/api/supplier/${id}`, updatedData);
				if (response.status === 200) {
					alert("거래처가 성공적으로 수정되었습니다.");
				}
			} else {
				// 거래처 등록
				const newSupplierData = {
					...formData,
					createdAt: new Date().toISOString(), // 등록일은 현재 시간으로 자동 설정
				};

				const response = await axios.post('/api/supplier', newSupplierData);
				if (response.status === 200 || response.status === 201) {
					alert("거래처가 성공적으로 등록되었습니다.");
				}
			}
			navigate('/suppliers'); // 거래처 목록으로 이동
		} catch (err) {
			setError('거래처 저장 중 오류가 발생했습니다.');
			console.error(err);
		}
	};

	const handleSearch = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post('/api/business/status', {
				b_no: [businessNumber],
			});
			const data = response.data.data[0];
			if (data) {
				setFormData((prevData) => ({
					...prevData,
					businessRegistrationNumber: data.b_no,
					taxpayerStatus: data.b_stt,
					taxpayerStatusCode: data.b_stt_cd,
					taxType: data.tax_type,
					taxTypeCode: data.tax_type_cd,
					closureDate: data.end_dt !== '00000000' ? data.end_dt : '',
					utccYn: data.utcc_yn,
					recentTaxTypeChangeDate: data.tax_type_change_dt !== '00000000' ? data.tax_type_change_dt : '',
					invoiceApplyDate: data.invoice_apply_dt !== '00000000' ? data.invoice_apply_dt : '',
					previousTaxType: data.rbf_tax_type,
					previousTaxTypeCode: data.rbf_tax_type_cd,
				}));
			} else {
				setError('등록된 정보가 없습니다.');
			}
		} catch (err) {
			setError('사업자 상태를 조회하는데 오류가 발생했습니다.');
			console.error(err);
		}
	};

	return (
		<div className="container">
			<h1 className="text-center mt-4">{id ? '거래처 수정' : '거래처 등록'} 폼</h1>
			<form onSubmit={handleSearch} className="mb-4">
				<div className="form-group row">
					<label htmlFor="businessNumber" className="col-sm-2 col-form-label">
						사업자 등록번호:
					</label>
					<div className="col-sm-10">
						<input
							type="text"
							className="form-control"
							id="businessNumber"
							value={businessNumber}
							onChange={(e) => setBusinessNumber(e.target.value)}
							placeholder="사업자 등록번호 입력"
						/>
					</div>
				</div>
				<button type="submit" className="btn btn-primary mt-3">조회</button>
			</form>

			<h3>기본정보</h3>
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label>거래처 코드:</label>
					<input
						type="text"
						name="supplierCode"
						className="form-control"
						value={formData.supplierCode}
						onChange={handleInputChange}
						required
					/>
				</div>
				<div className="form-group">
					<label>거래처명 (상호명):</label>
					<input
						type="text"
						name="name"
						className="form-control"
						value={formData.name}
						onChange={handleInputChange}
						required
					/>
				</div>
				<div className="form-group">
					<label>사업자등록번호:</label>
					<input
						type="text"
						name="businessRegistrationNumber"
						className="form-control"
						value={formData.businessRegistrationNumber}
						readOnly
					/>
				</div>
				<div className="form-group">
					<label>납세자 상태:</label>
					<input
						type="text"
						name="taxpayerStatus"
						className="form-control"
						value={formData.taxpayerStatus}
						readOnly
					/>
				</div>
				<div className="form-group">
					<label>납세자 상태 코드:</label>
					<input
						type="text"
						name="taxpayerStatusCode"
						className="form-control"
						value={formData.taxpayerStatusCode}
						readOnly
					/>
				</div>
				<div className="form-group">
					<label>세금 유형:</label>
					<input
						type="text"
						name="taxType"
						className="form-control"
						value={formData.taxType}
						readOnly
					/>
				</div>
				<div className="form-group">
					<label>세금 유형 코드:</label>
					<input
						type="text"
						name="taxTypeCode"
						className="form-control"
						value={formData.taxTypeCode}
						readOnly
					/>
				</div>
				<div className="form-group">
					<label>폐업일:</label>
					<input
						type="date"
						name="closureDate"
						className="form-control"
						value={formData.closureDate}
						readOnly
					/>
				</div>
				<div className="form-group">
					<label>단위과세전환폐업 여부:</label>
					<input
						type="text"
						name="utccYn"
						className="form-control"
						value={formData.utccYn}
						readOnly
					/>
				</div>
				<div className="form-group">
					<label>최근 과세유형 전환일자:</label>
					<input
						type="date"
						name="recentTaxTypeChangeDate"
						className="form-control"
						value={formData.recentTaxTypeChangeDate}
						readOnly
					/>
				</div>
				<div className="form-group">
					<label>세금계산서 적용일자:</label>
					<input
						type="date"
						name="invoiceApplyDate"
						className="form-control"
						value={formData.invoiceApplyDate}
						readOnly
					/>
				</div>
				<div className="form-group">
					<label>직전 과세유형:</label>
					<input
						type="text"
						name="previousTaxType"
						className="form-control"
						value={formData.previousTaxType}
						readOnly
					/>
				</div>
				<div className="form-group">
					<label>직전 과세유형 코드:</label>
					<input
						type="text"
						name="previousTaxTypeCode"
						className="form-control"
						value={formData.previousTaxTypeCode}
						readOnly
					/>
				</div>

				<h3>추가 정보 입력</h3>
				<div className="form-group">
					<label>대표자 성명:</label>
					<input
						type="text"
						name="representativeName"
						className="form-control"
						value={formData.representativeName}
						onChange={handleInputChange}
					/>
				</div>
				<div className="form-group">
					<label>업종:</label>
					<input
						type="text"
						name="businessType"
						className="form-control"
						value={formData.businessType}
						onChange={handleInputChange}
					/>
				</div>
				<div className="form-group">
					<label>업태:</label>
					<input
						type="text"
						name="businessItem"
						className="form-control"
						value={formData.businessItem}
						onChange={handleInputChange}
					/>
				</div>
				<div className="form-group">
					<label>주소:</label>
					<input
						type="text"
						name="address"
						className="form-control"
						value={formData.address}
						onChange={handleInputChange}
					/>
				</div>
				<div className="form-group">
					<label>연락처:</label>
					<input
						type="text"
						name="contactNumber"
						className="form-control"
						value={formData.contactNumber}
						onChange={handleInputChange}
					/>
				</div>
				<div className="form-group">
					<label>팩스번호:</label>
					<input
						type="text"
						name="faxNumber"
						className="form-control"
						value={formData.faxNumber}
						onChange={handleInputChange}
					/>
				</div>
				<div className="form-group">
					<label>담당자 정보:</label>
					<input
						type="text"
						name="managerInfo"
						className="form-control"
						value={formData.managerInfo}
						onChange={handleInputChange}
					/>
				</div>
				<div className="form-group">
					<label>은행 정보:</label>
					<input
						type="text"
						name="bankInfo"
						className="form-control"
						value={formData.bankInfo}
						onChange={handleInputChange}
					/>
				</div>
				<div className="form-group">
					<label>거래처 유형:</label>
					<select
						name="supplierType"
						className="form-control"
						value={formData.supplierType}
						onChange={handleInputChange}
					>
						<option value="1">매출</option>
						<option value="2">매입</option>
						<option value="3">동시</option>
					</select>
				</div>

				<button type="submit" className="btn btn-success mt-3">
					{id ? '수정' : '저장'}
				</button>
			</form>

			{error && (
				<div className="alert alert-danger mt-4">
					{error}
				</div>
			)}
		</div>
	);
}

export default SupplierForm;
