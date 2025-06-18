package marchtue.reuse.user.infrastructure;

import java.util.UUID;
import marchtue.reuse.user.domain.model.User;
import marchtue.reuse.user.domain.repository.UserRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaUserRepository extends UserRepository, JpaRepository<UUID, User> {

}
