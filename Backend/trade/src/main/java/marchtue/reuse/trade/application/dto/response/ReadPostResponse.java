package marchtue.reuse.trade.application.dto.response;

public record ReadPostResponse(

    ReadProductResponse product,
    ReadSellerResponse seller
) {

}
