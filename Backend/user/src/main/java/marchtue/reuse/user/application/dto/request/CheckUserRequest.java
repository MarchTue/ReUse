package marchtue.reuse.user.application.dto.request;

import jakarta.validation.constraints.NotBlank;

public record CheckUserRequest(

    @NotBlank String name,
    @NotBlank String phone,
    @NotBlank String ci_hs,
    @NotBlank String did
) {

}
