package marchtue.reuse.user.domain.repository;

import java.util.Optional;
import java.util.UUID;
import marchtue.reuse.user.domain.model.User;

public interface UserRepository {

  User findByNickname(String nickname);

  User save(User user);

  User findByCiHs(String ciHs);

  Optional<User> findById(UUID id);
}
