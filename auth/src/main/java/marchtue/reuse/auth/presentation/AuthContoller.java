package marchtue.reuse.auth.presentation;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.Value;
import lombok.extern.slf4j.Slf4j;
import marchtue.reuse.auth.application.dto.request.UserInfoRequest;
import marchtue.reuse.auth.application.dto.response.UserInfoResponse;
import marchtue.reuse.auth.application.service.AuthService;
import marchtue.reuse.auth.global.ApiResponse;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthContoller {


  private final AuthService authService;

  // 유저 존재 여부 확인
  @PostMapping("/certify")
  public ApiResponse<UserInfoResponse> certify(
      @RequestBody @Valid UserInfoRequest req,
      HttpServletResponse httpResponse
  ) {
    return authService.certify(req, httpResponse);

  }
}
