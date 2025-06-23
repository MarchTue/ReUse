package marchtue.reuse.auth.domain.model;

import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import marchtue.reuse.auth.domain.enums.UserRoleEnum;

@AllArgsConstructor
@Builder
@Getter
public class AuthenticatedUser {

  private final UUID userId;
  private final UserRoleEnum role;

}
