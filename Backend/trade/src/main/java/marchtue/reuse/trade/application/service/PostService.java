package marchtue.reuse.trade.application.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import marchtue.reuse.trade.application.client.UserClient;
import marchtue.reuse.trade.application.dto.request.CreatePostRequest;
import marchtue.reuse.trade.application.dto.response.CreatePostResponse;
import marchtue.reuse.trade.application.dto.response.ReadPostListResponse;
import marchtue.reuse.trade.application.dto.response.UserSimpleInfoResponse;
import marchtue.reuse.trade.domain.model.Category;
import marchtue.reuse.trade.domain.model.Post;
import marchtue.reuse.trade.domain.model.PostImage;
import marchtue.reuse.trade.domain.repository.FavPostRepository;
import marchtue.reuse.trade.domain.repository.PostRepository;
import marchtue.reuse.trade.exception.BusinessException;
import marchtue.reuse.trade.exception.ErrorCode;
import marchtue.reuse.trade.global.dto.ApiResponse;
import marchtue.reuse.trade.global.util.RequestUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PostService {

  private final PostRepository postRepository;
  private final FavPostRepository favPostRepository;
  private final CategoryService categoryService;
  private final UserClient userClient;

  @Transactional
  public ApiResponse createPost(CreatePostRequest req) {

    if (!req.isDirect() && !req.isDirect()) {
      throw new BusinessException(ErrorCode.TRADE_WAY_ERROR);
    }
    if (req.isDirect() && req.directAddress() == null) {
      throw new BusinessException(ErrorCode.DIRECT_ADDRESS);
    }
    Category category = categoryService.findById(req.category());

    List<PostImage> imageEntities = req.images().stream()
        .map(link -> PostImage.builder()
            .imageLink(link)
            .build())
        .toList();

    Post post = Post.create(
        req.title(),
        req.content(),
        req.isParcel(),
        req.isDirect(),
        req.directAddress(),
        req.productState(),
        req.price(),
        category,
        imageEntities
    );

    imageEntities.forEach(img -> img.setPost(post));
    Post savedPost = postRepository.save(post);

    CreatePostResponse res = new CreatePostResponse(savedPost.getId());

    return ApiResponse.ok(res);

  }

  public ApiResponse readPostList(UUID categoryId) {
    List<Post> posts = (categoryId == null)
        ? postRepository.findAll()
        : postRepository.findByCategory(categoryService.findById(categoryId));

    // 작성자 ID 목록 수집
    List<UUID> userIds = posts.stream()
        .map(Post::getCreatedBy)
        .distinct()
        .toList();

    // 사용자 정보 배치 요청
    List<UserSimpleInfoResponse> userInfos = userClient.getUserInfoList(userIds);

    // Map<UUID, UserInfoResponse> 구성
    Map<UUID, UserSimpleInfoResponse> userInfoMap = userInfos.stream()
        .collect(Collectors.toMap(UserSimpleInfoResponse::userId, Function.identity()));

    UUID currentUserId = RequestUtil.getCurrentUserId();

    // 응답 변환
    List<ReadPostListResponse> res = posts.stream()
        .map(post -> {
          UserSimpleInfoResponse userInfo = userInfoMap.get(post.getCreatedBy());
          String nickname = userInfo != null ? userInfo.nickname() : null;
          BigDecimal rating = userInfo != null ? userInfo.rating() : null;
          boolean isFav = favPostRepository.existsByUserIdAndPostId(currentUserId, post.getId());
          return ReadPostListResponse.from(post, nickname, rating, isFav);
        })
        .toList();

    return ApiResponse.ok(res);
  }
}
