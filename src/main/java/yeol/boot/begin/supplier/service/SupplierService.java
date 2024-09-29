package yeol.boot.begin.supplier.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import yeol.boot.begin.supplier.entity.Supplier;
import yeol.boot.begin.supplier.repository.SupplierRepository;

@Service
public class SupplierService {

	@Autowired
	private SupplierRepository supplierRepository;

	// 전체조회
	public List<Supplier> getAllSupplier() {
		return supplierRepository.findAll();
	}

	// 상세조회
	public Optional<Supplier> getFindById(Long id) {
		return supplierRepository.findById(id);
	}

	// 거래처명으로 조회
	public List<Supplier> getFindbyName(String name) {
		return supplierRepository.findByName(name);
	}

	// 사업자번호로 조회
	public Optional<Supplier> getFindByBusinessRegistrationNumber(String businessRegistrationNumber) {
		return supplierRepository.findBybusinessRegistrationNumber(businessRegistrationNumber);
	}

	// 거래처 등록
	public Supplier registerSupplier(Supplier supplier) {
		// 사업자번호 중복확인
		Optional<Supplier> existingSupplier = supplierRepository
				.findBybusinessRegistrationNumber(supplier.getBusinessRegistrationNumber());
		if (existingSupplier.isPresent()) {
			throw new IllegalStateException("이미 존재하는 사업자 등록번호입니다.");
		}

		return supplierRepository.save(supplier);
	}

	// 거래처 수정
	public Supplier updateSupplier(Long id, String name, String address, String contactNumber, String faxNumber,
			String managerInfo, String bankInfo, String supplierType, String representativeName, String businessType,
			String businessItem) {
		// ID로 거래처 조회
		Supplier supplier = supplierRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Supplier not found"));

		// 추가 입력한 정보들만 수정
		if (name != null && !name.isEmpty()) {
			supplier.setName(name);
		}

		if (address != null && !address.isEmpty()) {
			supplier.setAddress(address);
		}

		if (contactNumber != null && !contactNumber.isEmpty()) {
			supplier.setContactNumber(contactNumber);
		}

		if (faxNumber != null && !faxNumber.isEmpty()) {
			supplier.setFaxNumber(faxNumber);
		}

		if (managerInfo != null && !managerInfo.isEmpty()) {
			supplier.setManagerInfo(managerInfo);
		}

		if (bankInfo != null && !bankInfo.isEmpty()) {
			supplier.setBankInfo(bankInfo);
		}

		if (supplierType != null && !supplierType.isEmpty()) {
			supplier.setSupplierType(supplierType);
		}

		if (representativeName != null && !representativeName.isEmpty()) {
			supplier.setRepresentativeName(representativeName);
		}

		if (businessType != null && !businessType.isEmpty()) {
			supplier.setBusinessType(businessType);
		}

		if (businessItem != null && !businessItem.isEmpty()) {
			supplier.setBusinessItem(businessItem);
		}

// 수정된 날짜 업데이트
		supplier.setUpdatedAt(LocalDate.now());

// 저장 및 반환
		return supplierRepository.save(supplier);
	}

	// 거래처 삭제
	public void deleteSupplier(Long id) {
		supplierRepository.findById(id).orElseThrow(() -> new RuntimeException("Supplier not found "));
		supplierRepository.deleteById(id);
	}
}
