package marchtue.reuse.user.application.dto.request;

import marchtue.reuse.user.domain.enums.BankEnum;

public record AccountInfo(
    BankEnum bank,
    String account
) {

}
