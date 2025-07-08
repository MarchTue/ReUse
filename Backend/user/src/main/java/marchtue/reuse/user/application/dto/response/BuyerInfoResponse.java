package marchtue.reuse.user.application.dto.response;

import java.util.UUID;

public record BuyerInfoResponse(

    UUID userId,
    String nickname,
    String profile
) {

}
