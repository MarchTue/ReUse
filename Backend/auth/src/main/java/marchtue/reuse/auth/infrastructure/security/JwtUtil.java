package marchtue.reuse.auth.infrastructure.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import java.security.Key;
import java.util.Base64;
import java.util.Date;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
public class JwtUtil {

  public static final Logger logger = LoggerFactory.getLogger("JWT 관련 로그");

  public static final String AUTHORIZATION_HEADER = "Authorization";
  public static final String REFRESH_TOKEN_COOKIE = "Refresh_Token";
  public static final String BEARER_PREFIX = "Bearer ";

  private final long ACCESS_TOKEN_EXPIRATION = 1000 * 60 * 15;
  private final long REFRESH_TOKEN_EXPIRATION = 1000 * 60 * 60 * 24 * 3;

  @Value("${jwt.secret.key}")
  private String secretKey;

  private Key key;

  @PostConstruct
  public void init() {
    byte[] bytes = Base64.getDecoder().decode(secretKey);
    key = Keys.hmacShaKeyFor(bytes);
  }

  public String createAccessToken(String username) {
    Date now = new Date();
    Date expireDate = new Date(now.getTime() + ACCESS_TOKEN_EXPIRATION);
    return Jwts.builder()
        .setSubject(username)
        .setExpiration(expireDate)
        .signWith(key, SignatureAlgorithm.HS256)
        .compact();
  }

  public String createRefreshToken(String username) {
    Date now = new Date();
    Date expireDate = new Date(now.getTime() + REFRESH_TOKEN_EXPIRATION);

    return Jwts.builder()
        .setSubject(username)
        .setIssuedAt(now)
        .setExpiration(expireDate)
        .signWith(key, SignatureAlgorithm.HS256)
        .compact();
  }

  public HttpHeaders createAccessTokenHeader(String accessToken) {
    HttpHeaders headers = new HttpHeaders();
    headers.add(AUTHORIZATION_HEADER, BEARER_PREFIX + accessToken);
    return headers;
  }

  public ResponseCookie createRefreshTokenCookie(String refreshToken) {
    return ResponseCookie.from("Refresh-Token", refreshToken)
        .httpOnly(true)
        .secure(true)
        .path("/")
        .maxAge(3 * 24 * 60 * 60)
        .build();
  }

  public boolean validateToken(String token) {
    try {
      Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
      return true;
    } catch (SecurityException | MalformedJwtException e) {
      logger.error("Invalid JWT signature");
    } catch (ExpiredJwtException e) {
      logger.error("Expire JWT token");
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
}
