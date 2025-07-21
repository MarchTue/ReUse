package marchtue.reuse.trade.application.dto.response;

import java.util.UUID;
import marchtue.reuse.trade.domain.enums.ProposalStateEnum;
import marchtue.reuse.trade.domain.enums.ProposalTradeTypeEnum;
import marchtue.reuse.trade.domain.model.Proposal;

public record BuyerInfoResponse(
    UUID proposalId,
    UUID buyerId,
    ProposalTradeTypeEnum type,
    String address,
    long price,

    ProposalStateEnum state

) {

  public static BuyerInfoResponse from(Proposal proposal) {
    return new BuyerInfoResponse(
        proposal.getId(),
        proposal.getCreatedBy(),
        proposal.getType(),
        proposal.getAddress(),
        proposal.getPrice(),
        proposal.getState()
    );
  }
}
