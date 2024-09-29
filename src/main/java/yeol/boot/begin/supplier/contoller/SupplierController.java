package yeol.boot.begin.supplier.contoller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.websocket.server.PathParam;
import yeol.boot.begin.supplier.entity.Supplier;
import yeol.boot.begin.supplier.service.SupplierService;

@RestController
@RequestMapping("/api/supplier")
public class SupplierController {
	@Autowired
	private SupplierService supplierService;

	// 전체조회
	@GetMapping()
	public List<Supplier> getAllSupplier() {
		return supplierService.getAllSupplier();
	}

	// 상세조회
	@GetMapping("/{id}")
	public ResponseEntity<Supplier> getFindById(@PathVariable("id") Long id) {
		Supplier supplier = supplierService.getFindById(id).orElseThrow(() -> new RuntimeException());

		return ResponseEntity.ok(supplier);

	}

	// 거래처명 조회
	@GetMapping("/{name}")
	public ResponseEntity<List<Supplier>> getFindByName(@PathVariable("name") String name) {
		List<Supplier> supplier = supplierService.getFindbyName(name);
		return ResponseEntity.ok(supplier);
	}

	// 사업자번호 조회
	@GetMapping("/businessRegistrationNumber")
	public ResponseEntity<Supplier> getFindByBusinessRegistrationNumber(
			@PathVariable("businessRegistrationNumber") String businessRegistrationNumber) {
		Optional<Supplier> supplier = supplierService.getFindByBusinessRegistrationNumber(businessRegistrationNumber);
		return ResponseEntity.ok(supplier.get());
	}

	// 거래처 등록
	@PostMapping()
	public ResponseEntity<Supplier> addSupplier (@RequestBody Supplier supplier){
		
		return ResponseEntity<Supplier>.ok(supplierService.registerSupplier(supplier));
		
	}
	// 거래처 수정

	// 거래처 삭제

}
