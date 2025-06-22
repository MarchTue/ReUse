package marchtue.reuse.auth.application.client;


import marchtue.reuse.auth.application.dto.response.UserInfoResponse;
import org.springframework.stereotype.Component;

@Component
public interface UserClient {

  UserInfoResponse findByCi(String ciHs, String did);
}

