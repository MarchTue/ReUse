package marchtue.reuse.trade.presentation;

import java.util.UUID;
import lombok.RequiredArgsConstructor;
import marchtue.reuse.trade.application.dto.request.CreatePostRequest;
import marchtue.reuse.trade.application.dto.request.UpdatePostRequest;
import marchtue.reuse.trade.application.service.PostService;
import marchtue.reuse.trade.global.dto.ApiResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
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

  // 게시글 검색
  @GetMapping("/search")
  public ApiResponse searchPosts(
      @RequestParam("keyword") String keyword,
      @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
  ) {
    return postService.searchPosts(keyword, pageable);
  }

  // 게시글 수정
  @PatchMapping("/{postId}")
  public ApiResponse updatePost(
      @PathVariable UUID postId,
      @RequestBody UpdatePostRequest req
  ) {
    return postService.updatePost(postId, req);
  }

  // 게시글 삭제
  @DeleteMapping("/{postId}")
  public ApiResponse deletePost(
      @PathVariable UUID postId
  ) {
    return postService.deletePost(postId);
  }

  // 판매중 게시글 조회
  @GetMapping("/selling/{userId}")
  public ApiResponse getSellingPosts(
      @PathVariable UUID userId,
      @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
  ) {
    return postService.getSellingPosts(userId, pageable);
  }

  // 판매완료 게시글 조회
//  @GetMapping("/completed")
//  public ApiResponse getSaleCompletedPosts(
//      @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
//  ) {
//    return postService.getSaleCompletedPosts(pageable);
//  }
}
