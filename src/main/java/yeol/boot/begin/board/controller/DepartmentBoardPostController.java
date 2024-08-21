package yeol.boot.begin.board.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;
import yeol.boot.begin.board.entity.DepartmentBoardPost;
import yeol.boot.begin.board.service.DepartmentBoardPostService;
import yeol.boot.begin.emp.entity.Employee;
import yeol.boot.begin.emp.service.EmployeeService;

import java.util.List;

@RestController
@RequestMapping("/api/department-board")
public class DepartmentBoardPostController {

    @Autowired
    private DepartmentBoardPostService postService;

    @Autowired
    private EmployeeService employeeService;

    @GetMapping
    public List<DepartmentBoardPost> getAllPosts(HttpSession session) {
        Integer deptNo = (Integer) session.getAttribute("deptno");
        if (deptNo != null) {
            return postService.getPostsByDeptNo(deptNo);
        } else {
            return postService.getAllPosts(); // 전체 게시물 조회
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<DepartmentBoardPost> getPostById(@PathVariable("id") Long id) {
        DepartmentBoardPost post = postService.getPostById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        return ResponseEntity.ok(post);
    }


    @PostMapping
    public DepartmentBoardPost createPost(@RequestBody DepartmentBoardPost post, HttpSession session) {
        Long empNo = (Long) session.getAttribute("empno");
        if (empNo == null) {
            throw new RuntimeException("Employee number not found in session.");
        }
        // 추가적인 로그 출력
        System.out.println("empNo from session: " + empNo);
        
        Employee employee = employeeService.getEmployeeByEmpno(empNo)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        post.setEmpNo(empNo);
        post.setAuthor(employee.getEname());
        post.setDeptNo(employee.getDeptno());

        return postService.createPost(post);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DepartmentBoardPost> updatePost(@PathVariable("id") Long id,
                                                          @RequestBody DepartmentBoardPost postDetails) {
        DepartmentBoardPost updatedPost = postService.updatePost(id, postDetails);
        return ResponseEntity.ok(updatedPost);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable("id") Long id) {
        postService.deletePost(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/department/{deptNo}")
    public List<DepartmentBoardPost> getPostsByDeptNo(@PathVariable("deptNo") Integer deptNo) {
        return postService.getPostsByDeptNo(deptNo);
    }
}
