package marchtue.reuse.trade.application.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;
import marchtue.reuse.trade.domain.enums.PostStateEnum;
import marchtue.reuse.trade.domain.model.Post;

public record ReadSellingPostListResponse(
    UUID postId,
    String title,
    long price,
    LocalDateTime createdAt,
    String thumbnail,
    PostStateEnum dealState
) {

  public static ReadSellingPostListResponse from(Post post, String thumbnail) {
    return new ReadSellingPostListResponse(
        post.getId(),
        post.getTitle(),
        post.getPrice(),
        post.getCreatedAt(),
        thumbnail,
        post.getPostState()
    );
  }
}
