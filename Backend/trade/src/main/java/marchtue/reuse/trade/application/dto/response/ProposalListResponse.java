package marchtue.reuse.trade.application.dto.response;

import marchtue.reuse.trade.domain.enums.ProposalTradeTypeEnum;
import marchtue.reuse.trade.domain.model.Proposal;

public record ProposalListResponse(
    String nickname,
    String profile,
    long price,
    ProposalTradeTypeEnum type
) {

  public static ProposalListResponse from(Proposal proposal, String nickname, String profile) {
    return new ProposalListResponse(
        nickname,
        profile,
        proposal.getPrice(),
        proposal.getType()
    );
  }
}
