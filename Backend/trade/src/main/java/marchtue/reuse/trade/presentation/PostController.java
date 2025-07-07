package marchtue.reuse.trade.presentation;

import lombok.RequiredArgsConstructor;
import marchtue.reuse.trade.application.dto.request.CreatePostRequest;
import marchtue.reuse.trade.application.service.PostService;
import marchtue.reuse.trade.global.dto.ApiResponse;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
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
}
