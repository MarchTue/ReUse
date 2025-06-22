package marchtue.reuse.user.application.dto.request;

import jakarta.validation.constraints.NotBlank;

public record UserInfoRequest(

    @NotBlank String ci_sh,
    @NotBlank String did,
    @NotBlank String deviceId,
    @NotBlank String userAgent,
    String platform
) {

}
