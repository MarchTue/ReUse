package marchtue.reuse.trade.application.client;


import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import marchtue.reuse.trade.application.dto.response.BuyerInfoResponse;
import marchtue.reuse.trade.application.dto.response.ReadSellerResponse;
import marchtue.reuse.trade.application.dto.response.UserSimpleInfoResponse;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class UserClientImpl implements UserClient {

  private final RestTemplate restTemplate;

  public UserClientImpl() {
    this.restTemplate = new RestTemplate();
  }

  @Override
  public List<UserSimpleInfoResponse> getUserInfoList(List<UUID> userIds) {
    String url = "http://user-service:19091/internal/users/info-list";
    HttpEntity<List<UUID>> request = new HttpEntity<>(userIds);
    ResponseEntity<UserSimpleInfoResponse[]> response = restTemplate.postForEntity(url, request,
        UserSimpleInfoResponse[].class);
    return Arrays.asList(Objects.requireNonNull(response.getBody()));
  }

  @Override
  public ReadSellerResponse getSellerInfo(UUID sellerId) {
    String url = "http://user-service:19091/internal/users/seller-info/{sellerId}";
    ReadSellerResponse response = restTemplate.getForObject(url, ReadSellerResponse.class,
        sellerId);
    return response;
  }

  @Override
  public List<BuyerInfoResponse> getBuyerInfoList(List<UUID> userIds) {
    String url = "http://user-service:19091/internal/users/buyer-infos";
    HttpEntity<List<UUID>> request = new HttpEntity<>(userIds);
    ResponseEntity<BuyerInfoResponse[]> response = restTemplate.postForEntity(url, request,
        BuyerInfoResponse[].class);
    return Arrays.asList(Objects.requireNonNull(response.getBody()));
  }

}