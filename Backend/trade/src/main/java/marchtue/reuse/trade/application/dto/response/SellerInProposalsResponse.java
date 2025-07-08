package marchtue.reuse.trade.application.dto.response;

import java.util.List;

public record SellerInProposalsResponse(
    ReadProductResponse product,
    ReadSellerResponse seller,
    List<ProposalListResponse> proposals
) {

}
