package marchtue.reuse.trade.application.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;
import marchtue.reuse.trade.domain.enums.ProductStateEnum;

public record UpdatePostRequest(
    @NotNull String title,
    @NotNull UUID category,
    @Min(0L) Long price,
    @NotNull List<String> images,
    String description,
    boolean isDirect,
    String directAddress,
    boolean parcel,
    @NotNull ProductStateEnum productState
) {

}
