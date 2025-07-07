package marchtue.reuse.trade.application.client;


import java.util.List;
import java.util.UUID;
import marchtue.reuse.trade.application.dto.response.BuyerInfoResponse;
import marchtue.reuse.trade.application.dto.response.ReadSellerResponse;
import marchtue.reuse.trade.application.dto.response.UserSimpleInfoResponse;

public interface UserClient {

  List<UserSimpleInfoResponse> getUserInfoList(List<UUID> userIds);

  ReadSellerResponse getSellerInfo(UUID sellerId);

  List<BuyerInfoResponse> getBuyerInfoList(List<UUID> userIds);
}

