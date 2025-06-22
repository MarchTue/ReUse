package marchtue.reuse.auth.application.dto.response;

import marchtue.reuse.auth.domain.enums.UserRoleEnum;

public record UserInfoResponse(
    String userId,
    UserRoleEnum role
) {
}
