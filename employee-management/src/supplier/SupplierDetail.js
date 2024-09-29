import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function SupplierDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [supplier, setSupplier] = useState(null);

    useEffect(() => {
        axios.get(`/api/supplier/${id}`)
            .then(response => setSupplier(response.data))
            .catch(error => console.error('거래처 세부 정보를 불러오는 중 오류 발생:', error));
    }, [id]);

    return (
        <div className="container" style={{ padding: '20px' }}>
            {supplier ? (
                <>
                    <h1>거래처 상세 정보</h1>
                    <div className="card p-4 mb-4">
                        <p><strong>거래처 코드:</strong> {supplier.supplierCode}</p>
                        <p><strong>거래처명 (상호명):</strong> {supplier.name}</p>
                        <p><strong>사업자등록번호:</strong> {supplier.businessRegistrationNumber}</p>
                        <p><strong>납세자 상태 (명칭):</strong> {supplier.taxpayerStatus}</p>
                        <p><strong>납세자 상태 코드:</strong> {supplier.taxpayerStatusCode}</p>
                        <p><strong>과세유형명칭:</strong> {supplier.taxType}</p>
                        <p><strong>과세유형 코드:</strong> {supplier.taxTypeCode}</p>
                        <p><strong>폐업일:</strong> {supplier.closureDate ? supplier.closureDate : '해당 없음'}</p>
                        <p><strong>단위과세전환폐업여부:</strong> {supplier.utccYn}</p>
                        <p><strong>최근 과세유형 전환일자:</strong> {supplier.recentTaxTypeChangeDate ? supplier.recentTaxTypeChangeDate : '해당 없음'}</p>
                        <p><strong>세금계산서 적용일자:</strong> {supplier.invoiceApplyDate ? supplier.invoiceApplyDate : '해당 없음'}</p>
                        <p><strong>직전 과세유형:</strong> {supplier.previousTaxType}</p>
                        <p><strong>직전 과세유형 코드:</strong> {supplier.previousTaxTypeCode}</p>
                        <p><strong>대표자 성명:</strong> {supplier.representativeName}</p>
                        <p><strong>업종:</strong> {supplier.businessType}</p>
                        <p><strong>업태:</strong> {supplier.businessItem}</p>
                        <p><strong>주소:</strong> {supplier.address}</p>
                        <p><strong>연락처:</strong> {supplier.contactNumber}</p>
                        <p><strong>팩스번호:</strong> {supplier.faxNumber}</p>
                        <p><strong>담당자 정보:</strong> {supplier.managerInfo}</p>
                        <p><strong>은행 정보 (은행명, 계좌):</strong> {supplier.bankInfo}</p>
                        <p><strong>거래처 유형 (매출, 매입, 동시):</strong> {
                            supplier.supplierType === '1' ? '매출' :
                            supplier.supplierType === '2' ? '매입' : '동시'
                        }</p>
                        <p><strong>생성일:</strong> {supplier.createdAt ? supplier.createdAt : '해당 없음'}</p>
                        <p><strong>수정일:</strong> {supplier.updatedAt ? supplier.updatedAt : '해당 없음'}</p>
                    </div>
                    <div>
                        <Link to={`/suppliers/edit/${id}`} className="btn btn-warning mr-2">수정</Link>
                        <button className="btn btn-secondary" onClick={() => navigate('/suppliers')}>목록으로 돌아가기</button>
                    </div>
                </>
            ) : (
                <p>거래처 정보를 불러오는 중입니다...</p>
            )}
        </div>
    );
}

export default SupplierDetail;
