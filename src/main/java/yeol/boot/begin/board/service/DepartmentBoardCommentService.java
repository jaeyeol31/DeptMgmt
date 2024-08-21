package yeol.boot.begin.board.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import yeol.boot.begin.board.entity.DepartmentBoardComment;
import yeol.boot.begin.board.repository.DepartmentBoardCommentRepository;

import java.util.List;

@Service
public class DepartmentBoardCommentService {

    @Autowired
    private DepartmentBoardCommentRepository commentRepository;

    public List<DepartmentBoardComment> getCommentsByPostId(Long postId) {
        return commentRepository.findByPostId(postId);
    }

    public DepartmentBoardComment createComment(DepartmentBoardComment comment) {
        return commentRepository.save(comment);
    }

    public void deleteComment(Long id) {
        commentRepository.deleteById(id);
    }
}
