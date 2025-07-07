package marchtue.reuse.trade.global.util;

import java.util.UUID;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class RequestUtil {

  private RequestUtil() {
    throw new UnsupportedOperationException("requestUtil class err");
  }

  public static UUID getCurrentUserId() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();

    if (auth == null || !auth.isAuthenticated() || auth.getPrincipal() == null) {
      return null;
    }

    return (UUID) auth.getPrincipal();
  }


}
