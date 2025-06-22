package marchtue.reuse.auth.infrastructure;

import java.util.UUID;
import marchtue.reuse.auth.domain.model.UserSession;
import marchtue.reuse.auth.domain.repository.UserSessionRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaUserSessionRepository extends UserSessionRepository, JpaRepository<UserSession, UUID> {
}
