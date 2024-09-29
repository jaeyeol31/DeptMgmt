package yeol.boot.begin.supplier.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "supplier")
public class Supplier {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	// 거래처 코드 : 00101~97999 범위내에서 입력
	@Column(name = "supplier_code", unique = true, nullable = false, length = 5)
	private String supplierCode;

	// 거래처명 (상호명)
	@Column(name = "name", nullable = false)
	private String name;

	// 사업자등록번호
	@Column(name = "business_registration_number", nullable = false, length = 10)
	private String businessRegistrationNumber;

	// 납세자 상태 (명칭)
	@Column(name = "taxpayer_status")
	private String taxpayerStatus; // 계속사업자, 휴업자, 폐업자 등

	// 납세자 상태 코드
	@Column(name = "taxpayer_status_code")
	private String taxpayerStatusCode; // 01, 02, 03 등

	// 과세유형명칭
	@Column(name = "tax_type")
	private String taxType; // 일반과세자, 간이과세자 등

	// 과세유형 코드
	@Column(name = "tax_type_code")
	private String taxTypeCode; // 01, 02, 03 등

	// 폐업일
	@Column(name = "closure_date")
	private LocalDate closureDate;

	// 단위과세전환폐업여부
	@Column(name = "utcc_yn")
	private String utccYn; // Y/N 여부

	// 최근 과세유형 전환일자
	@Column(name = "recent_tax_type_change_date")
	private LocalDate recentTaxTypeChangeDate;

	// 세금계산서 적용일자
	@Column(name = "invoice_apply_date")
	private LocalDate invoiceApplyDate;

	// 직전 과세유형
	@Column(name = "previous_tax_type")
	private String previousTaxType;

	// 직전 과세유형 코드
	@Column(name = "previous_tax_type_code")
	private String previousTaxTypeCode;

	// 대표자 성명
	@Column(name = "representative_name")
	private String representativeName;

	// 업종 
	@Column(name = "business_type")
	private String businessType;
	
	//업태
	@Column(name = "business_item")
	private String businessItem;

	// 주소
	@Column(name = "address")
	private String address;

	// 연락처 
	@Column(name = "contact_number")
	private String contactNumber;
	
	//팩스번호
	@Column(name = "fax_number")
	private String faxNumber;

	//담당자 정보 
	@Column(name = "manager_info")
	private String managerInfo;

	// 은행 정보 (은행명,계좌)
	@Column(name = "bank_info")
	private String bankInfo;

	// 거래처 유형 (매출, 매입, 동시)
	@Column(name = "supplier_type")
	private String supplierType; // 1:매출, 2:매입, 3:동시

	// 생성 및 수정 날짜
	@Column(name = "created_at")
	private LocalDate createdAt;

	@Column(name = "updated_at")
	private LocalDate updatedAt;
}