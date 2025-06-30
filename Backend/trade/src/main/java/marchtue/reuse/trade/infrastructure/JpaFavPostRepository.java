package marchtue.reuse.trade.infrastructure;

import java.util.UUID;
import marchtue.reuse.trade.domain.model.FavPost;
import marchtue.reuse.trade.domain.repository.FavPostRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaFavPostRepository extends FavPostRepository, JpaRepository<FavPost, UUID> {

}
