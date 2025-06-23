package marchtue.reuse.user.application.dto.response;

import marchtue.reuse.user.domain.enums.UserRoleEnum;

public record UserInfoResponse(
    String userId,
    UserRoleEnum role
) {

}
