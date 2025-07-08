package marchtue.reuse.user.application.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
import marchtue.reuse.user.domain.model.User;
import marchtue.reuse.user.domain.model.UserRating;

public record ReadSellerResponse(
    UUID sellerId,
    String profile,
    String nickname,
    LocalDateTime createdAt,
    BigDecimal rating,
    Long inProgressTrade,
    Long completedTrade
) {

  public static ReadSellerResponse from(User user, UserRating userRating) {
    return new ReadSellerResponse(
        user.getId(),
        user.getProfileImage(),
        user.getNickname(),
        user.getCreatedAt(),
        userRating.getRateScore(),
        userRating.getInProgressTrade(),
        userRating.getCompletedTrade()
    );
  }
}
