package marchtue.reuse.auth.application.dto.request;

import jakarta.validation.constraints.NotBlank;

public record UserInfoRequest(

    @NotBlank String ciHs,
    @NotBlank String did,
    @NotBlank String deviceId,
    @NotBlank String userAgent,
    String platform
) {

}
