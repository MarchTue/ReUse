package marchtue.reuse.trade.application.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
import marchtue.reuse.trade.domain.enums.PostStateEnum;
import marchtue.reuse.trade.domain.enums.ProductStateEnum;
import marchtue.reuse.trade.domain.model.Post;

public record ReadPostListResponse(
    UUID postId,
    String title,
    String nickname,
    BigDecimal rating,
    long price,
    LocalDateTime createdAt,
    PostStateEnum postState,
    ProductStateEnum productState,
    String thumbnail,
    boolean isFav
) {

  public static ReadPostListResponse from(Post post, String nickname, BigDecimal rating,
      boolean isFav) {
    String thumbnail = post.getPostImages().isEmpty() ?
        null : post.getPostImages().get(0).getImageLink();

    return new ReadPostListResponse(
        post.getId(),
        post.getTitle(),
        nickname,
        rating,
        post.getPrice(),
        post.getCreatedAt(),
        post.getPostState(),
        post.getProductState(),
        thumbnail,
        isFav);
  }
}
