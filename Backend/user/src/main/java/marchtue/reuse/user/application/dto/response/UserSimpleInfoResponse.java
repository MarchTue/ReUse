package marchtue.reuse.user.application.dto.response;

import java.math.BigDecimal;
import java.util.UUID;

public record UserSimpleInfoResponse(
    UUID sellerId,
    String nickname,
    BigDecimal rating
) {

}