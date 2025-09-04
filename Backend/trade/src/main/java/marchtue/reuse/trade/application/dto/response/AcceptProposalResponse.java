package marchtue.reuse.trade.application.dto.response;

import java.util.UUID;
import marchtue.reuse.trade.domain.enums.ProposalDealTypeEnum;

public record AcceptProposalResponse(
    UUID buyerId,
    ProposalDealTypeEnum tradeWay,
    String address

) {

}
