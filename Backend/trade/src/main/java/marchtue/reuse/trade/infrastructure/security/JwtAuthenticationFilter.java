package marchtue.reuse.trade.infrastructure.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import marchtue.reuse.trade.global.dto.ErrorResponse;
import marchtue.reuse.trade.global.util.JwtUtil;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

  private final JwtUtil jwtUtil;

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
      FilterChain filterChain) throws ServletException, IOException {

    String token = jwtUtil.getTokenFromHeader(request, JwtUtil.AUTHORIZATION_HEADER);
    try {
      if (jwtUtil.validateToken(token)) {
        // 토큰이 유효하면 인증 처리
        Claims claims = jwtUtil.getUserInfoFromToken(token);
        UUID userId = UUID.fromString(claims.getSubject());
        String role = claims.get("role", String.class);
        List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(role));

        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
            userId, null, authorities);

        SecurityContextHolder.getContext().setAuthentication(authentication);
      } else {
        // 유효하지 않으면 명시적으로 리턴
        setErrorResponse(response, "Invalid JWT Token", HttpServletResponse.SC_UNAUTHORIZED);
        return;
      }

    } catch (ExpiredJwtException e) {
      logger.error("Expired JWT Token");
      setErrorResponse(response, "Access Token Expired", HttpServletResponse.SC_UNAUTHORIZED);
      return;
    } catch (JwtException | IllegalArgumentException e) {
      logger.error("Invalid JWT Token");
      setErrorResponse(response, "Invalid JWT Token", HttpServletResponse.SC_UNAUTHORIZED);
      return;
    }
    filterChain.doFilter(request, response);
  }

  private void setErrorResponse(HttpServletResponse response, String message, int status)
      throws IOException {
    response.setStatus(status);
    response.setContentType("application/json;charset=UTF-8");

    ErrorResponse errorResponse = new ErrorResponse(status, message);

    ObjectMapper mapper = new ObjectMapper();
    response.getWriter().write(mapper.writeValueAsString(errorResponse));
  }
}
