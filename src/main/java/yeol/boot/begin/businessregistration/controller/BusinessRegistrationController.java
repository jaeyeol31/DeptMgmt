package yeol.boot.begin.businessregistration.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import yeol.boot.begin.businessregistration.service.BusinessRegistrationService;

import java.util.Map;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/business")
public class BusinessRegistrationController {

    private final BusinessRegistrationService businessService;

    @Autowired
    public BusinessRegistrationController(BusinessRegistrationService businessService) {
        this.businessService = businessService;
    }

    @PostMapping("/status")
    public ResponseEntity<String> getStatus(@RequestBody Map<String, Object> request) {
        try {
            List<String> businessNumbers = (List<String>) request.get("b_no");
            String response = businessService.getBusinessStatus(businessNumbers);
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("API 호출 중 오류가 발생했습니다. (IOException)");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("API 호출 중 알 수 없는 오류가 발생했습니다.");
        }
    }
}
