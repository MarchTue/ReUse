package marchtue.reuse.trade.application.dto.request;

import jakarta.validation.constraints.Min;

public record CreateProposalRequest(
    @Min(0) long price,
    boolean direct,
    boolean parcel,
    String address

) {

}
