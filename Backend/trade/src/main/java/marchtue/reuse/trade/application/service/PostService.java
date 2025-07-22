package marchtue.reuse.trade.application.service;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import marchtue.reuse.trade.application.client.UserClient;
import marchtue.reuse.trade.application.dto.request.CreatePostRequest;
import marchtue.reuse.trade.application.dto.response.BuyerInfoResponse;
import marchtue.reuse.trade.application.dto.response.CreatePostResponse;
import marchtue.reuse.trade.application.dto.response.InTradingPostResponse;
import marchtue.reuse.trade.application.dto.response.InprogressPostResponse;
import marchtue.reuse.trade.application.dto.response.InternalBuyerInfoResponse;
import marchtue.reuse.trade.application.dto.response.InternalUserInfoWithImgResponse;
import marchtue.reuse.trade.application.dto.response.InternalUserSimpleInfoResponse;
import marchtue.reuse.trade.application.dto.response.ProposalListResponse;
import marchtue.reuse.trade.application.dto.response.ReadPostListResponse;
import marchtue.reuse.trade.application.dto.response.ReadPostResponse;
import marchtue.reuse.trade.application.dto.response.ReadProductResponse;
import marchtue.reuse.trade.application.dto.response.ReadSellerResponse;
import marchtue.reuse.trade.application.dto.response.SearchPostListResponse;
import marchtue.reuse.trade.domain.enums.PostStateEnum;
import marchtue.reuse.trade.domain.enums.ProposalStateEnum;
import marchtue.reuse.trade.domain.model.Category;
import marchtue.reuse.trade.domain.model.Post;
import marchtue.reuse.trade.domain.model.PostImage;
import marchtue.reuse.trade.domain.model.Proposal;
import marchtue.reuse.trade.domain.model.QPost;
import marchtue.reuse.trade.domain.repository.FavPostRepository;
import marchtue.reuse.trade.domain.repository.PostImageRepository;
import marchtue.reuse.trade.domain.repository.PostRepository;
import marchtue.reuse.trade.domain.repository.ProposalRepository;
import marchtue.reuse.trade.exception.BusinessException;
import marchtue.reuse.trade.exception.ErrorCode;
import marchtue.reuse.trade.global.dto.ApiResponse;
import marchtue.reuse.trade.global.dto.PaginatedResponse;
import marchtue.reuse.trade.global.util.RequestUtil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Slf4j
@Service
@RequiredArgsConstructor
public class PostService {

  private final PostRepository postRepository;
  private final FavPostRepository favPostRepository;
  private final ProposalRepository proposalRepository;
  private final JPAQueryFactory queryFactory;
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

    List<InternalUserSimpleInfoResponse> userInfos = userClient.getUserInfoList(userIds);
    Map<UUID, InternalUserSimpleInfoResponse> userInfoMap = userInfos.stream()
        .collect(Collectors.toMap(InternalUserSimpleInfoResponse::userId, Function.identity()));

    UUID currentUserId = RequestUtil.getCurrentUserId();

    List<ReadPostListResponse> content = posts.stream()
        .map(post -> {
          InternalUserSimpleInfoResponse userInfo = userInfoMap.get(post.getCreatedBy());
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
    if (sellerId.equals(currentId)) {
      if (post.getPostState().equals(PostStateEnum.IN_PROGRESS)) {

        List<Proposal> proposalList = post.getProposals();
        List<UUID> userIds = proposalList.stream()
            .map(Proposal::getCreatedBy)
            .distinct()
            .toList();

        List<InternalBuyerInfoResponse> userInfos = userClient.getBuyerInfoList(userIds);
        Map<UUID, InternalBuyerInfoResponse> buyerInfoMap = userInfos.stream()
            .collect(Collectors.toMap(InternalBuyerInfoResponse::userId, Function.identity()));

        List<ProposalListResponse> buyerInfoList = proposalList.stream()
            .map(proposal -> {
              InternalBuyerInfoResponse userInfo = buyerInfoMap.get(proposal.getCreatedBy());
              String nickname = userInfo != null ? userInfo.nickname() : null;
              String profile = userInfo != null ? userInfo.profile() : null;
              return ProposalListResponse.from(proposal, nickname, profile);
            })
            .toList();

        InprogressPostResponse res = new InprogressPostResponse(postInfo, sellerInfo,
            buyerInfoList);

        return ApiResponse.ok(res);
      } else {
        Proposal acceptedProposal = findAcceptedProposal(postId);
        // 거래 중, 거래 완료
        BuyerInfoResponse buyerInfo = BuyerInfoResponse.from(acceptedProposal);
        InTradingPostResponse response = new InTradingPostResponse(postInfo, sellerInfo, buyerInfo);
        return ApiResponse.ok(response);
      }
    }

    ReadPostResponse res = new ReadPostResponse(postInfo, sellerInfo);
    return ApiResponse.ok(res);

  }

  public ApiResponse searchPosts(String keyword, Pageable pageable) {
    QPost post = QPost.post;

    BooleanExpression condition = StringUtils.hasText(keyword)
        ? post.title.containsIgnoreCase(keyword)
        .or(post.content.containsIgnoreCase(keyword))
        : null;

    List<Post> pagedPosts = queryFactory
        .selectFrom(post)
        .where(condition)
        .orderBy(post.createdAt.desc(), post.id.desc())
        .offset(pageable.getOffset())
        .limit(pageable.getPageSize())
        .fetch();

    if (pagedPosts.isEmpty()) {
      Page<SearchPostListResponse> emptyPage = new PageImpl<>(List.of(), pageable, 0);
      return ApiResponse.ok(PaginatedResponse.of(emptyPage));
    }

    long total = Optional.ofNullable(
        queryFactory
            .select(post.count())
            .from(post)
            .where(condition)
            .fetchOne()
    ).orElse(0L);

    List<UUID> userIds = pagedPosts.stream()
        .map(Post::getCreatedBy)
        .distinct()
        .toList();

    List<InternalUserInfoWithImgResponse> userInfos =
        userClient.getUserInfoListWithProfile(userIds);

    Map<UUID, InternalUserInfoWithImgResponse> userInfoMap = userInfos.stream()
        .collect(Collectors.toMap(InternalUserInfoWithImgResponse::userId, Function.identity()));

    UUID currentUserId = RequestUtil.getCurrentUserId();
    Set<UUID> postIds = pagedPosts.stream()
        .map(Post::getId)
        .collect(Collectors.toSet());

    Set<UUID> favPostIds = favPostRepository
        .findPostIdsByUserIdAndPostIdIn(currentUserId, postIds);

    List<SearchPostListResponse> content = pagedPosts.stream()
        .map(p -> {
          InternalUserInfoWithImgResponse ui = userInfoMap.get(p.getCreatedBy());
          String nickname = ui != null ? ui.nickname() : null;
          String profile = ui != null ? ui.profile() : null;
          boolean isFav = favPostIds.contains(p.getId());
          return SearchPostListResponse.from(p, nickname, profile, isFav);
        })
        .toList();

    Page<SearchPostListResponse> page = new PageImpl<>(content, pageable, total);
    return ApiResponse.ok(PaginatedResponse.of(page));
  }


  private Post findById(UUID postId) {
    return postRepository.findById(postId)
        .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND));
  }

  private Proposal findAcceptedProposal(UUID postId) {
    return proposalRepository.findByPostIdAndState(postId, ProposalStateEnum.ACCEPTED);
  }
}
