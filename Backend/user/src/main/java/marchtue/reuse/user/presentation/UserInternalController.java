package marchtue.reuse.user.presentation;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import marchtue.reuse.user.application.dto.request.DidCheckRequest;
import marchtue.reuse.user.application.dto.request.UserInfoRequest;
import marchtue.reuse.user.application.dto.response.UserInfoResponse;
import marchtue.reuse.user.application.service.UserService;
import marchtue.reuse.user.domain.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/internal/users")
@RequiredArgsConstructor
public class UserInternalController {

  private final UserService userService;

  @PostMapping("/ci")
  public UserInfoResponse findByCi(
      @RequestBody UserInfoRequest req
  ) {
    // 사용자 존재 여부 확인 후 반환
    User user = userService.findByCi(req.ci_sh());

    log.info("조회된 유저: {}", user);

    if (user == null) {
      return new UserInfoResponse(null, null);
    }

    UserInfoResponse res = new UserInfoResponse(user.getId().toString(), user.getRole());
    log.info("응답: {}", res);
    return res;
  }

  @PostMapping("/did")
  public ResponseEntity<Void> CheckDid(@RequestBody DidCheckRequest req) {
    userService.checkDid(req.userId(), req.did());
    return ResponseEntity.ok().build();
  }

}
