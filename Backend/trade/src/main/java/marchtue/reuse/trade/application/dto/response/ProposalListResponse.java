package marchtue.reuse.trade.application.dto.response;

import java.util.UUID;
import marchtue.reuse.trade.domain.enums.ProposalDealTypeEnum;
import marchtue.reuse.trade.domain.model.Proposal;

public record ProposalListResponse(
    UUID proposalId,
    String nickname,
    String profile,
    long price,
    ProposalDealTypeEnum type
) {

  public static ProposalListResponse from(Proposal proposal, String nickname, String profile) {
    return new ProposalListResponse(
        proposal.getId(),
        nickname,
        profile,
        proposal.getPrice(),
        proposal.getType()
    );
  }
}
