package marchtue.reuse.auth.application.client;


import marchtue.reuse.auth.application.dto.response.UserInfoResponse;

public interface UserClient {

  UserInfoResponse findByCi(String ciHs);
}

