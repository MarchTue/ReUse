package marchtue.reuse.trade.application.dto.response;

import java.util.List;

public record InprogressPostResponse(
    ReadProductResponse product,
    ReadSellerResponse seller,
    List<ProposalListResponse> proposals
) {

}
