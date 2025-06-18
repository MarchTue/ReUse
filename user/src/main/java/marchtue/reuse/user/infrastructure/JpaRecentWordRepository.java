package marchtue.reuse.user.infrastructure;

import java.util.UUID;
import marchtue.reuse.user.domain.model.RecentWord;
import marchtue.reuse.user.domain.repository.RecentWordRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaRecentWordRepository extends RecentWordRepository,
    JpaRepository<UUID, RecentWord> {

}
