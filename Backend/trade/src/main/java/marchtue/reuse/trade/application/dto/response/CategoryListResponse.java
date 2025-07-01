package marchtue.reuse.trade.application.dto.response;

import java.util.UUID;

public record CategoryListResponse(
    UUID categoryId,
    String name
) {

}
