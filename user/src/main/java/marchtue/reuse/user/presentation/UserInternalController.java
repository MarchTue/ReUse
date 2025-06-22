package marchtue.reuse.user.presentation;

import lombok.RequiredArgsConstructor;
import marchtue.reuse.user.application.dto.request.UserInfoRequest;
import marchtue.reuse.user.application.dto.response.UserInfoResponse;
import marchtue.reuse.user.application.service.UserService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    var user = userService.findByCi(req.ci_sh());
    if (user == null) {
      return new UserInfoResponse(null, null);
    }

    return new UserInfoResponse(user.getId().toString(), user.getRole());
  }

}
