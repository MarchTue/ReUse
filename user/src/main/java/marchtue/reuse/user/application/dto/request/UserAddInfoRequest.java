package marchtue.reuse.user.application.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import marchtue.reuse.user.domain.enums.DidTypeEnum;

public record UserAddInfoRequest(

    @NotBlank String ci_hs,
    @NotBlank String did,
    @NotNull DidTypeEnum didType,
    @NotBlank String name,
    @NotBlank String phone,
    @NotBlank String nickname,
    String profileImage,
    AccountInfo accountInfo,
    WalletInfo walletInfo
) {

}
