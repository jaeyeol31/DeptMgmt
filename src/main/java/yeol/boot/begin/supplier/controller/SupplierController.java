package yeol.boot.begin.supplier.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import yeol.boot.begin.supplier.entity.Supplier;
import yeol.boot.begin.supplier.service.SupplierService;

@RestController
@RequestMapping("/api/supplier")
public class SupplierController {

    @Autowired
    private SupplierService supplierService;

    // 전체 조회
    @GetMapping
    public List<Supplier> getAllSupplier() {
        return supplierService.getAllSupplier();
    }

    // ID로 상세 조회
    @GetMapping("/{id}")
    public ResponseEntity<Supplier> getFindById(@PathVariable("id") Long id) {
        Supplier supplier = supplierService.getFindById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found with id: " + id));

        return ResponseEntity.ok(supplier);
    }

    // 거래처명으로 조회 (경로 구분)
    @GetMapping("/name/{name}")
    public ResponseEntity<List<Supplier>> getFindByName(@PathVariable("name") String name) {
        List<Supplier> suppliers = supplierService.getFindbyName(name);
        return ResponseEntity.ok(suppliers);
    }

    // 사업자번호로 조회
    @GetMapping("/businessRegistrationNumber/{businessRegistrationNumber}")
    public ResponseEntity<Supplier> getFindByBusinessRegistrationNumber(
            @PathVariable("businessRegistrationNumber") String businessRegistrationNumber) {
        Optional<Supplier> supplier = supplierService.getFindByBusinessRegistrationNumber(businessRegistrationNumber);
        return supplier.map(ResponseEntity::ok)
                .orElseThrow(() -> new RuntimeException("Supplier not found with businessRegistrationNumber: " + businessRegistrationNumber));
    }

    // 거래처 등록
    @PostMapping
    public ResponseEntity<Supplier> registerSupplier(@RequestBody Supplier supplier) {
        Supplier savedSupplier = supplierService.registerSupplier(supplier);
        return ResponseEntity.ok(savedSupplier);
    }

    // 거래처 수정
    @PutMapping("/{id}")
    public ResponseEntity<Supplier> updateSupplier(@PathVariable("id") Long id,
            @RequestBody Supplier updatedSupplierDetails) {

        Supplier updatedSupplier = supplierService.updateSupplier(
                id,
                updatedSupplierDetails.getName(),
                updatedSupplierDetails.getAddress(),
                updatedSupplierDetails.getContactNumber(),
                updatedSupplierDetails.getFaxNumber(),
                updatedSupplierDetails.getManagerInfo(),
                updatedSupplierDetails.getBankInfo(),
                updatedSupplierDetails.getSupplierType(),
                updatedSupplierDetails.getRepresentativeName(),
                updatedSupplierDetails.getBusinessType(),
                updatedSupplierDetails.getBusinessItem());

        return ResponseEntity.ok(updatedSupplier);
    }

    // 거래처 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSupplier(@PathVariable("id") Long id) {
        supplierService.deleteSupplier(id);
        return ResponseEntity.noContent().build();
    }
}
