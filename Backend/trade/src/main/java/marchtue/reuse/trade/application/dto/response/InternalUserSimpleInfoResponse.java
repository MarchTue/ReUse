package marchtue.reuse.trade.application.dto.response;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import java.math.BigDecimal;
import java.util.UUID;

@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public record InternalUserSimpleInfoResponse(
    UUID userId,
    String nickname,
    BigDecimal rating
) {

}
