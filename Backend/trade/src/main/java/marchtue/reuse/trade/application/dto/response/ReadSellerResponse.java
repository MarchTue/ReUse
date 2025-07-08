package marchtue.reuse.trade.application.dto.response;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public record ReadSellerResponse(
    UUID sellerId,
    String profile,
    String nickname,
    LocalDateTime createdAt,
    BigDecimal rating,
    Long inProgressTrade,
    Long completedTrade
) {

}
