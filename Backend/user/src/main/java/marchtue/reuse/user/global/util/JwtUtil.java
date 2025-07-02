package marchtue.reuse.user.global.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import java.security.Key;
import java.util.Base64;
import marchtue.reuse.user.domain.enums.UserRoleEnum;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
public class JwtUtil {

  public static final Logger logger = LoggerFactory.getLogger("JWT 관련 로그");

  public static final String AUTHORIZATION_HEADER = "Authorization";
  public static final String REFRESH_TOKEN_COOKIE = "Refresh_Token";
  public static final String BEARER_PREFIX = "Bearer ";

  @Value("${jwt.secret.key}")
  private String secretKey;

  private Key key;

  @PostConstruct
  public void init() {
    byte[] bytes = Base64.getDecoder().decode(secretKey);
    key = Keys.hmacShaKeyFor(bytes);
  }

  public boolean validateToken(String token) {
    try {
      Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
      return true;
    } catch (SecurityException | MalformedJwtException e) {
      logger.error("Invalid JWT signature");
    } catch (ExpiredJwtException e) {
      logger.error("Expired JWT token");
    } catch (UnsupportedJwtException e) {
      logger.error("Unsupported JWT token");
    } catch (IllegalArgumentException e) {
      logger.error("JWT claims is empty");
    }
    return false;
  }

  public String getTokenFromHeader(HttpServletRequest request, String headerName) {
    String headerValue = request.getHeader(headerName);
    if (StringUtils.hasText(headerValue) && headerValue.startsWith(BEARER_PREFIX)) {
      return headerValue.substring(BEARER_PREFIX.length());
    }
    return null;
  }

  public String getTokenFromCookie(HttpServletRequest request, String cookieName) {
    if (request.getCookies() != null) {
      for (Cookie cookie : request.getCookies()) {
        if (cookie.getName().equals(cookieName)) {
          return cookie.getValue();
        }
      }
    }
    return null;
  }

  public Claims getUserInfoFromToken(String token) {
    return Jwts.parserBuilder()
        .setSigningKey(key)
        .build()
        .parseClaimsJws(token)
        .getBody();
  }


  public UserRoleEnum getUserRole(String token) {
    Claims claims = getUserInfoFromToken(token);
    String role = claims.get("role", String.class);
    return UserRoleEnum.valueOf(role);
  }
}
