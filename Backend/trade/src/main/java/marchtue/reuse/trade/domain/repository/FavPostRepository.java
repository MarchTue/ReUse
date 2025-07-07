package marchtue.reuse.trade.domain.repository;

import java.util.UUID;

public interface FavPostRepository {

  boolean existsByUserIdAndPostId(UUID currentUserId, UUID id);

}
