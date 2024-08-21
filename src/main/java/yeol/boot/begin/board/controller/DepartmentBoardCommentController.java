package yeol.boot.begin.board.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;
import yeol.boot.begin.board.entity.DepartmentBoardComment;
import yeol.boot.begin.board.service.DepartmentBoardCommentService;
import yeol.boot.begin.board.service.DepartmentBoardPostService;
import yeol.boot.begin.emp.entity.Employee;
import yeol.boot.begin.emp.service.EmployeeService;

import java.util.List;

@RestController
@RequestMapping("/api/department-board")
public class DepartmentBoardCommentController {

    @Autowired
    private DepartmentBoardCommentService commentService;

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private DepartmentBoardPostService postService;

    @GetMapping("/{postId}/comments")
    public List<DepartmentBoardComment> getCommentsByPostId(@PathVariable("postId") Long postId) {
        return commentService.getCommentsByPostId(postId);
    }

    @PostMapping("/{postId}/comments")
    public DepartmentBoardComment createComment(@PathVariable("postId") Long postId,
                                                @RequestBody DepartmentBoardComment comment,
                                                HttpSession session) {
        Long empNo = (Long) session.getAttribute("empno");
        if (empNo == null) {
            throw new RuntimeException("Employee number not found in session.");
        }

        Employee employee = employeeService.getEmployeeByEmpno(empNo)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        comment.setEmpNo(empNo);
        comment.setAuthor(employee.getEname());
        comment.setDeptNo(employee.getDeptno());
        comment.setPost(postService.getPostById(postId).orElseThrow(() -> new RuntimeException("Post not found")));

        return commentService.createComment(comment);
    }

    @DeleteMapping("/{postId}/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable("postId") Long postId, @PathVariable("commentId") Long commentId) {
        commentService.deleteComment(commentId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{postId}/comments/{commentId}")
    public ResponseEntity<DepartmentBoardComment> updateComment(@PathVariable("postId") Long postId, @PathVariable("commentId") Long commentId,
                                                               @RequestBody DepartmentBoardComment commentDetails) {
        DepartmentBoardComment comment = commentService.getCommentsByPostId(postId)
                .stream().filter(c -> c.getId().equals(commentId)).findFirst()
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        comment.setContent(commentDetails.getContent());
        DepartmentBoardComment updatedComment = commentService.createComment(comment);

        return ResponseEntity.ok(updatedComment);
    }
}
