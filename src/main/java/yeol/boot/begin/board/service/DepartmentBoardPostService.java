package yeol.boot.begin.board.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import yeol.boot.begin.board.entity.DepartmentBoardPost;
import yeol.boot.begin.board.repository.DepartmentBoardPostRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class DepartmentBoardPostService {

    @Autowired
    private DepartmentBoardPostRepository postRepository;

    public List<DepartmentBoardPost> getAllPosts() {
        return postRepository.findAll();
    }

    public List<DepartmentBoardPost> getPostsByDeptNo(Integer deptNo) {
        return postRepository.findByDeptNo(deptNo);
    }

    public Optional<DepartmentBoardPost> getPostById(Long id) {
        return postRepository.findById(id);
    }

    public DepartmentBoardPost createPost(DepartmentBoardPost post) {
        return postRepository.save(post);
    }

    public DepartmentBoardPost updatePost(Long id, DepartmentBoardPost postDetails) {
        DepartmentBoardPost post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        post.setTitle(postDetails.getTitle());
        post.setContent(postDetails.getContent());
        post.setUpdatedAt(LocalDateTime.now()); // 수정된 시간 업데이트

        return postRepository.save(post);
    }

    public void deletePost(Long id) {
        DepartmentBoardPost post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        postRepository.delete(post);
    }
}
