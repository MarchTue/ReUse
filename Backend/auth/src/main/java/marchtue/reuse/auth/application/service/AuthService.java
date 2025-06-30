package marchtue.reuse.auth.application.service;

import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import marchtue.reuse.auth.application.client.UserClient;
import marchtue.reuse.auth.application.dto.request.UserInfoRequest;
import marchtue.reuse.auth.application.dto.response.UserInfoResponse;
import marchtue.reuse.auth.domain.enums.UserRoleEnum;
import marchtue.reuse.auth.domain.model.UserSession;
import marchtue.reuse.auth.domain.repository.UserSessionRepository;
import marchtue.reuse.auth.global.ApiResponse;
import marchtue.reuse.auth.infrastructure.security.JwtUtil;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

  private final UserClient userClient;
  private final UserSessionRepository sessionRepository;
  private final JwtUtil jwtUtil;

  public ApiResponse certify(UserInfoRequest req, HttpServletResponse response) {
    UserInfoResponse user = userClient.findByCi(req.ciHs());

    if (user.userId() == null) {
      return new ApiResponse(404, "new user", "");
    }

    userClient.DidCheckDid(user.userId(), req.did());

    String accessToken = jwtUtil.createAccessToken(user.userId(), user.role());
    String refreshToken = jwtUtil.createRefreshToken(user.userId());

    UserSession session = UserSession.builder()
        .deviceId(req.deviceId())
        .userAgent(req.userAgent())
        .platform(req.platform())
        .loginAt(LocalDateTime.now())
        .userId(UUID.fromString(user.userId()))
        .isDeleted(false)
        .build();

    sessionRepository.save(session);

    HttpHeaders headers = jwtUtil.createAccessTokenHeader(accessToken);
    ResponseCookie refreshCookie = jwtUtil.createRefreshTokenCookie(refreshToken);

    response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());
    response.addHeader(JwtUtil.AUTHORIZATION_HEADER,
        headers.getFirst(JwtUtil.AUTHORIZATION_HEADER));

    return new ApiResponse<>(200, "logined", List.of(Map.of("user_id", user.userId())));
  }

  public ApiResponse reissue(HttpServletRequest request, HttpServletResponse response) {
    String refreshToken = jwtUtil.getTokenFromCookie(request, jwtUtil.REFRESH_TOKEN_COOKIE);

    if (refreshToken == null || !jwtUtil.validateToken(refreshToken)) {
      return new ApiResponse(401, "invalid token", null);
    }

    Claims claims = jwtUtil.getUserInfoFromToken(refreshToken);
    String username = claims.getSubject();

    String roleStr = claims.get("role", String.class);
    UserRoleEnum role = UserRoleEnum.valueOf(roleStr);

    String newAccessToken = jwtUtil.createAccessToken(username, role);

    HttpHeaders accessHeader = jwtUtil.createAccessTokenHeader(newAccessToken);
    response.addHeader(jwtUtil.AUTHORIZATION_HEADER,
        accessHeader.getFirst(jwtUtil.AUTHORIZATION_HEADER));

    return new ApiResponse(200, "token issued", null);
  }
}
