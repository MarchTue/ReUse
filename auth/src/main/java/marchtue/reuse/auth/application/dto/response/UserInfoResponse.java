package marchtue.reuse.auth.application.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import marchtue.reuse.auth.domain.enums.UserRoleEnum;

public record UserInfoResponse(
    @JsonProperty("user_id") String userId,
    @JsonProperty("role") UserRoleEnum role
) {

}
