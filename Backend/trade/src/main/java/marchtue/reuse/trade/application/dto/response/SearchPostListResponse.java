package marchtue.reuse.trade.application.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;
import marchtue.reuse.trade.domain.enums.PostStateEnum;
import marchtue.reuse.trade.domain.enums.ProductStateEnum;
import marchtue.reuse.trade.domain.model.Post;

public record SearchPostListResponse(

    UUID postId,
    String title,
    String nickname,
    String profile,
    long price,
    LocalDateTime createdAt,
    PostStateEnum postState,
    ProductStateEnum productState,
    String thumbnail,
    boolean isFav
) {

  public static SearchPostListResponse from(Post post, String nickname, String profile,
      boolean isFav) {
    String thumbnail = post.getPostImages().isEmpty() ?
        null : post.getPostImages().get(0).getImageLink();

    return new SearchPostListResponse(
        post.getId(),
        post.getTitle(),
        nickname,
        profile,
        post.getPrice(),
        post.getCreatedAt(),
        post.getPostState(),
        post.getProductState(),
        thumbnail,
        isFav);
  }

}
