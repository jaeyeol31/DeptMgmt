import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function SupplierList() {
    const [suppliers, setSuppliers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        try {
            const response = await axios.get('/api/supplier');
            setSuppliers(response.data);
        } catch (error) {
            console.error('거래처 목록을 불러오는 중 오류 발생:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/supplier/${id}`);
            alert('거래처가 삭제되었습니다.');
            fetchSuppliers(); // 삭제 후 목록을 다시 로드하여 최신화
        } catch (error) {
            console.error('거래처 삭제 중 오류 발생:', error);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>거래처 목록</h1>
            <button onClick={() => navigate('/suppliers/add')} className="btn btn-primary mb-3">
                거래처 등록
            </button>
            <table className="table table-bordered">
                <thead className="thead-light">
                    <tr>
                        <th>거래처명</th>
                        <th>사업자등록번호</th>
                        <th>대표자명</th>
                        <th>옵션</th>
                    </tr>
                </thead>
                <tbody>
                    {suppliers.map(supplier => (
                        <tr key={supplier.id}>
                            <td>{supplier.name}</td>
                            <td>{supplier.businessRegistrationNumber}</td>
                            <td>{supplier.representativeName}</td>
                            <td>
                                <Link to={`/suppliers/detail/${supplier.id}`} className="btn btn-info btn-sm mr-2">상세보기</Link>
                                <Link to={`/suppliers/edit/${supplier.id}`} className="btn btn-warning btn-sm mr-2">수정</Link>
                                <button
                                    onClick={() => handleDelete(supplier.id)}
                                    className="btn btn-danger btn-sm"
                                >
                                    삭제
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default SupplierList;
