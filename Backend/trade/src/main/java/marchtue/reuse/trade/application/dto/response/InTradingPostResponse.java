package marchtue.reuse.trade.application.dto.response;

public record InTradingPostResponse(

    ReadProductResponse product,
    ReadSellerResponse seller,
    BuyerInfoResponse buyer
) {

}
