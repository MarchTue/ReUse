package marchtue.reuse.trade.application.dto.request;

public record PatchCategoryRequest(
    String name,
    Boolean isActive
) {

}
