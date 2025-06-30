package marchtue.reuse.trade.global.util;

import jakarta.servlet.http.HttpServletRequest;
import java.util.UUID;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

public class RequestUtil {

  private RequestUtil() {
    throw new UnsupportedOperationException("requestUtil class err");
  }

  public static UUID getCurrentUserId() {
    ServletRequestAttributes attributes =
        (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();

    if (attributes == null) {
      return null;
    }

    HttpServletRequest req = attributes.getRequest();
    return UUID.fromString(req.getHeader("X-User-Id"));
  }

}
