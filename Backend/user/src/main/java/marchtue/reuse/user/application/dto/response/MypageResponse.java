package marchtue.reuse.user.application.dto.response;

import java.math.BigDecimal;

public record MypageResponse(
    String nickname,
    Long inProgressTrade,
    Long completedTrade,
    Long token,
    BigDecimal rateScore,
    String bank,
    String account,
    String phoneNumber
) {

}
