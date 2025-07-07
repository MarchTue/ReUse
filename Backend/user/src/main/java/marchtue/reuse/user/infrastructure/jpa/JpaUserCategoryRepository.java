package marchtue.reuse.user.infrastructure.jpa;

import java.util.UUID;
import marchtue.reuse.user.domain.model.UserCategory;
import marchtue.reuse.user.domain.repository.UserCategoryRepository;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JpaUserCategoryRepository extends UserCategoryRepository,
    JpaRepository<UserCategory, UUID> {

}
