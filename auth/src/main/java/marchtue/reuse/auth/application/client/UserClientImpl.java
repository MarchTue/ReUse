package marchtue.reuse.auth.application.client;


import java.util.HashMap;
import java.util.Map;
import marchtue.reuse.auth.application.dto.response.UserInfoResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class UserClientImpl implements UserClient {

  private final RestTemplate restTemplate;

  public UserClientImpl() {
    this.restTemplate = new RestTemplate();
  }

  @Override
  public UserInfoResponse findByCi(String ciSh) {
    Map<String, String> request = new HashMap<>();
    request.put("ci_sh", ciSh);

    String url = "http://user-service:19091/internal/users/ci";
    
    return restTemplate.postForObject(url, request, UserInfoResponse.class);
  }
}