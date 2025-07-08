package marchtue.reuse.trade.application.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import marchtue.reuse.trade.application.client.UserClient;
import marchtue.reuse.trade.application.dto.request.CreatePostRequest;
import marchtue.reuse.trade.application.dto.response.BuyerInfoResponse;
import marchtue.reuse.trade.application.dto.response.CreatePostResponse;
import marchtue.reuse.trade.application.dto.response.ProposalListResponse;
import marchtue.reuse.trade.application.dto.response.ReadPostListResponse;
import marchtue.reuse.trade.application.dto.response.ReadPostResponse;
import marchtue.reuse.trade.application.dto.response.ReadProductResponse;
import marchtue.reuse.trade.application.dto.response.ReadSellerResponse;
import marchtue.reuse.trade.application.dto.response.SellerInProposalsResponse;
import marchtue.reuse.trade.application.dto.response.UserSimpleInfoResponse;
import marchtue.reuse.trade.domain.enums.PostStateEnum;
import marchtue.reuse.trade.domain.model.Category;
import marchtue.reuse.trade.domain.model.Post;
import marchtue.reuse.trade.domain.model.PostImage;
import marchtue.reuse.trade.domain.model.Proposal;
import marchtue.reuse.trade.domain.repository.FavPostRepository;
import marchtue.reuse.trade.domain.repository.PostImageRepository;
import marchtue.reuse.trade.domain.repository.PostRepository;
import marchtue.reuse.trade.exception.BusinessException;
import marchtue.reuse.trade.exception.ErrorCode;
import marchtue.reuse.trade.global.dto.ApiResponse;
import marchtue.reuse.trade.global.dto.PaginatedResponse;
import marchtue.reuse.trade.global.util.RequestUtil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class PostService {

  private final PostRepository postRepository;
  private final FavPostRepository favPostRepository;
  private final CategoryService categoryService;
  private final PostImageRepository postImageRepository;
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

  public ApiResponse readPostList(UUID categoryId, int page, int size) {
    Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
    Page<Post> postPage = (categoryId == null)
        ? postRepository.findAll(pageable)
        : postRepository.findByCategory(categoryService.findById(categoryId), pageable);

    List<Post> posts = postPage.getContent();

    List<UUID> userIds = posts.stream()
        .map(Post::getCreatedBy)
        .distinct()
        .toList();

    List<UserSimpleInfoResponse> userInfos = userClient.getUserInfoList(userIds);
    Map<UUID, UserSimpleInfoResponse> userInfoMap = userInfos.stream()
        .collect(Collectors.toMap(UserSimpleInfoResponse::userId, Function.identity()));

    UUID currentUserId = RequestUtil.getCurrentUserId();

    List<ReadPostListResponse> content = posts.stream()
        .map(post -> {
          UserSimpleInfoResponse userInfo = userInfoMap.get(post.getCreatedBy());
          String nickname = userInfo != null ? userInfo.nickname() : null;
          BigDecimal rating = userInfo != null ? userInfo.rating() : null;
          boolean isFav = favPostRepository.existsByUserIdAndPostId(currentUserId, post.getId());
          return ReadPostListResponse.from(post, nickname, rating, isFav);
        })
        .toList();

    return ApiResponse.ok(new PaginatedResponse<>(
        postPage.getTotalElements(),
        postPage.getTotalPages(),
        page,
        size,
        content
    ));
  }

  // 게시물 상세조회
  public ApiResponse readPost(UUID postId) {
    Post post = findById(postId);
    UUID sellerId = post.getCreatedBy();
    UUID currentId = RequestUtil.getCurrentUserId();

    ReadSellerResponse sellerInfo = userClient.getSellerInfo(sellerId);
    boolean isFav = favPostRepository.existsByUserIdAndPostId(currentId,
        postId);
    List<String> images = postImageRepository.findAllByPostId(postId).stream()
        .map(PostImage::getImageLink)
        .toList();
    ReadProductResponse postInfo = ReadProductResponse.from(post, images, isFav);
    if (sellerId.equals(currentId) && post.getPostState().equals(PostStateEnum.IN_PROGRESS)) {

      List<Proposal> proposalList = post.getProposals();
      List<UUID> userIds = proposalList.stream()
          .map(Proposal::getCreatedBy)
          .distinct()
          .toList();

      List<BuyerInfoResponse> userInfos = userClient.getBuyerInfoList(userIds);
      Map<UUID, BuyerInfoResponse> buyerInfoMap = userInfos.stream()
          .collect(Collectors.toMap(BuyerInfoResponse::userId, Function.identity()));

      List<ProposalListResponse> buyerInfoList = proposalList.stream()
          .map(proposal -> {
            BuyerInfoResponse userInfo = buyerInfoMap.get(proposal.getCreatedBy());
            String nickname = userInfo != null ? userInfo.nickname() : null;
            String profile = userInfo != null ? userInfo.profile() : null;
            return ProposalListResponse.from(proposal, nickname, profile);
          })
          .toList();

      SellerInProposalsResponse res = new SellerInProposalsResponse(postInfo, sellerInfo,
          buyerInfoList);

      return ApiResponse.ok(res);
    }
    ReadPostResponse res = new ReadPostResponse(postInfo, sellerInfo);
    return ApiResponse.ok(res);

  }


  private Post findById(UUID postId) {
    return postRepository.findById(postId)
        .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND));
  }
}
