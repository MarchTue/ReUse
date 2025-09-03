package marchtue.reuse.trade.application.dto.response;

import marchtue.reuse.trade.global.dto.PaginatedResponse;

public record ReadSellingPostResponse(
    ReadSellerResponse seller,
    PaginatedResponse<ReadSellingPostListResponse> posts
) {

}
