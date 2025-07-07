package marchtue.reuse.trade.presentation;

import java.util.UUID;
import lombok.RequiredArgsConstructor;
import marchtue.reuse.trade.application.dto.request.CreatePostRequest;
import marchtue.reuse.trade.application.service.PostService;
import marchtue.reuse.trade.global.dto.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/be/v1/posts")
public class PostController {

  private final PostService postService;

  // 판매글 등록
  @PostMapping
  public ApiResponse createPost(
      @RequestBody CreatePostRequest req
  ) {
    return postService.createPost(req);
  }

  // 판매글 목록 조회
  @GetMapping
  public ApiResponse readPostList(
      @RequestParam(required = false) UUID categoryId,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size
  ) {
    return postService.readPostList(categoryId, page, size);
  }

  // 판매글 상세조회
  @GetMapping("/{postId}")
  public ApiResponse readPost(
      @PathVariable UUID postId
  ) {
    return postService.readPost(postId);
  }
}
