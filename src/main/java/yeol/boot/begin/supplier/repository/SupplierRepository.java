package yeol.boot.begin.supplier.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import yeol.boot.begin.supplier.entity.Supplier;

public interface SupplierRepository extends JpaRepository<Supplier, Long> {
	
	// 사업자번호로 조회
	Optional<Supplier> findBybusinessRegistrationNumber(String businessRegistrationNumber);

	//거래처명으로 조회
	List <Supplier> findByName(String name);
}
