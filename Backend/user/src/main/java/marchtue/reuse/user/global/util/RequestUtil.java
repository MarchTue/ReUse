package marchtue.reuse.user.global.util;

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

    String id = attributes.getRequest().getHeader("X-user-Id");
    if (id == null || id.isBlank()) {
      return null;
    }

    try {
      return UUID.fromString(id);
    } catch (IllegalArgumentException e) {
      return null;
    }
  }

}
