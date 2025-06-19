package marchtue.reuse.user.presentation;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import marchtue.reuse.user.application.dto.request.NicknameCheckRequest;
import marchtue.reuse.user.application.service.UserService;
import marchtue.reuse.user.global.dto.ApiResponse;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("api/v1/users")
@RequiredArgsConstructor
public class UserController {

  private final UserService userService;

  // 닉네임 유효성 검사
  @PostMapping("/check-nickname")
  public ApiResponse checkNickname(@RequestBody NicknameCheckRequest req) {
    return userService.checkNickname(req);
  }
}