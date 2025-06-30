package marchtue.reuse.trade.application.dto.response;

import java.util.UUID;

public record AddCategoryResponse(
    UUID categoryId,
    String name
) {

}
