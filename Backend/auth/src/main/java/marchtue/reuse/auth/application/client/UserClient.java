package marchtue.reuse.auth.application.client;


import java.util.UUID;
import marchtue.reuse.auth.application.dto.response.UserInfoResponse;

public interface UserClient {

  UserInfoResponse findByCi(String ciHs);

  void DidCheckDid(String userId, String did);
}

