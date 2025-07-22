package marchtue.reuse.trade.application.dto.response;

import java.util.UUID;

public record InternalUserInfoWithImgResponse(
    UUID userId,
    String nickname,
    String profile
) {

}
