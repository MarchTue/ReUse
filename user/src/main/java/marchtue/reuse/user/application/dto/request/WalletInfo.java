package marchtue.reuse.user.application.dto.request;

import marchtue.reuse.user.domain.enums.EWalletPlatformEnum;
import marchtue.reuse.user.domain.enums.EWalletTypeEnum;

public record WalletInfo(

    String address,
    EWalletTypeEnum type,
    EWalletPlatformEnum platform
) {

}
