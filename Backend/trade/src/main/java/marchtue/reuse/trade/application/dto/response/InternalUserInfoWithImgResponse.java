package marchtue.reuse.trade.application.dto.response;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import java.util.UUID;

@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public record InternalUserInfoWithImgResponse(
    UUID userId,
    String nickname,
    String profile
) {

}
