package marchtue.reuse.user.application.dto.request;

import jakarta.validation.constraints.NotNull;

public record UserCheckRequest(

    @NotNull String name,
    @NotNull String phone,
    @NotNull String ci_hs,
    @NotNull String did
) {

}
