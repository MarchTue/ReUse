package marchtue.reuse.trade.application.dto.response;

import java.math.BigDecimal;
import java.util.UUID;

public record InternalUserSimpleInfoResponse(
    UUID userId,
    String nickname,
    BigDecimal rating
) {

}
