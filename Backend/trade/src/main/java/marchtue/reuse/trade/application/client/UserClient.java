package marchtue.reuse.trade.application.client;


import java.util.List;
import java.util.UUID;
import marchtue.reuse.trade.application.dto.response.InternalBuyerInfoResponse;
import marchtue.reuse.trade.application.dto.response.InternalUserInfoWithImgResponse;
import marchtue.reuse.trade.application.dto.response.InternalUserSimpleInfoResponse;
import marchtue.reuse.trade.application.dto.response.ReadSellerResponse;

public interface UserClient {

  List<InternalUserSimpleInfoResponse> getUserInfoList(List<UUID> userIds);

  ReadSellerResponse getSellerInfo(UUID sellerId);

  List<InternalBuyerInfoResponse> getBuyerInfoList(List<UUID> userIds);

  List<InternalUserInfoWithImgResponse> getUserInfoListWithProfile(List<UUID> userIds);
}

