package marchtue.reuse.user.presentation;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import marchtue.reuse.user.application.dto.request.CheckUserRequest;
import marchtue.reuse.user.application.dto.request.NicknameCheckRequest;
import marchtue.reuse.user.application.dto.request.UserAddInfoRequest;
import marchtue.reuse.user.application.service.UserService;
import marchtue.reuse.user.global.dto.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("api/be/v1/users")
@RequiredArgsConstructor
public class UserController {

  private final UserService userService;

  // 닉네임 유효성 검사
  @PostMapping("/check-nickname")
  public ApiResponse checkNickname(@Valid @RequestBody NicknameCheckRequest req) {
    return userService.checkNickname(req);
  }

  // 회원 유무 확인
  @PostMapping("/check-user")
  public ApiResponse checkUser(@Valid @RequestBody CheckUserRequest req) {
    return userService.checkUser(req);
  }

  @PostMapping("/register")
  public ApiResponse registerUser(@Valid @RequestBody UserAddInfoRequest req) {
    return userService.registerUser(req);
  }

  @GetMapping("/me/{userId}")
  public ApiResponse myPage(
      HttpServletRequest request,
      @PathVariable UUID userId
  ) {
    return userService.myPage(request, userId);
  }

  @GetMapping("/category/{categoryId}")
  public ApiResponse favCategory(
      @PathVariable UUID categoryId,
      HttpServletRequest request
  ) {
    return userService.favCategory(categoryId, request);
  }
}