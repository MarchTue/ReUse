package marchtue.reuse.user.domain.repository;

import java.util.Optional;
import java.util.UUID;
import marchtue.reuse.user.domain.model.UserCategory;

public interface UserCategoryRepository {

  UserCategory save(UserCategory favCate);

  void delete(UserCategory category);

  Optional<UserCategory> findByUserIdAndCategoryId(UUID userId, UUID categoryId);
}
