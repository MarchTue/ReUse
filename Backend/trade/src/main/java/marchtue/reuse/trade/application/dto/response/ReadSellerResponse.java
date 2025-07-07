package marchtue.reuse.trade.application.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record ReadSellerResponse(
    UUID serllerId,
    String profile,
    String nickname,
    LocalDateTime createdAt,
    BigDecimal rating,
    Long inProgressTrade,
    Long completedTrade
) {

}
