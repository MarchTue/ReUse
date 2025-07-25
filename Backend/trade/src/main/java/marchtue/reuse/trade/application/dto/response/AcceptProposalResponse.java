package marchtue.reuse.trade.application.dto.response;

import java.util.UUID;
import marchtue.reuse.trade.domain.enums.ProposalTradeTypeEnum;

public record AcceptProposalResponse(
    UUID buyerId,
    ProposalTradeTypeEnum tradeWay,
    String address

) {

}
