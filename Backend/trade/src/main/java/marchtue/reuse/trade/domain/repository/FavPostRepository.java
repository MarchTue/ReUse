package marchtue.reuse.trade.domain.repository;

import java.util.Set;
import java.util.UUID;
import org.springframework.data.jpa.repository.Query;

public interface FavPostRepository {

  boolean existsByUserIdAndPostId(UUID currentUserId, UUID id);

  @Query("select f.post.id from FavPost f where f.userId = :userId and f.post.id in :postIds")
  Set<UUID> findPostIdsByUserIdAndPostIdIn(UUID userId, Set<UUID> postIds);
}
