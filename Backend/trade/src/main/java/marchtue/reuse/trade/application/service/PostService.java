package marchtue.reuse.trade.application.service;

import java.util.List;
import lombok.RequiredArgsConstructor;
import marchtue.reuse.trade.application.dto.request.CreatePostRequest;
import marchtue.reuse.trade.application.dto.response.CreatePostResponse;
import marchtue.reuse.trade.domain.model.Category;
import marchtue.reuse.trade.domain.model.Post;
import marchtue.reuse.trade.domain.model.PostImage;
import marchtue.reuse.trade.domain.repository.PostImageRepository;
import marchtue.reuse.trade.domain.repository.PostRepository;
import marchtue.reuse.trade.exception.BusinessException;
import marchtue.reuse.trade.exception.ErrorCode;
import marchtue.reuse.trade.global.dto.ApiResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PostService {

  private final PostRepository postRepository;
  private final PostImageRepository postImageRepository;
  private final CategoryService categoryService;

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
}
