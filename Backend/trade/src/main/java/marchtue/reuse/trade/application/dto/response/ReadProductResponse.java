package marchtue.reuse.trade.application.dto.response;

import java.time.LocalDateTime;
import java.util.List;
import marchtue.reuse.trade.domain.enums.PostStateEnum;
import marchtue.reuse.trade.domain.enums.ProductStateEnum;
import marchtue.reuse.trade.domain.model.Post;

public record ReadProductResponse(
    String title,
    String category,
    long price,
    List<String> images,
    String content,
    boolean isDirect,
    String directAddress,
    boolean isParcel,
    ProductStateEnum productState,
    boolean isFav,
    PostStateEnum postState,
    LocalDateTime createdAt

) {

  public static ReadProductResponse from(Post post, List<String> images, boolean isFav) {
    return new ReadProductResponse(
        post.getTitle(),
        post.getCategory().getName(),
        post.getPrice(),
        images,
        post.getContent(),
        post.getIsDirect(),
        post.getDirectAddress(),
        post.getIsParcel(),
        post.getProductState(),
        isFav,
        post.getPostState(),
        post.getCreatedAt()
    );
  }

}
