package marchtue.reuse.trade.infrastructure.jpa;

import java.util.UUID;
import marchtue.reuse.trade.domain.model.Review;
import marchtue.reuse.trade.domain.repository.ReviewRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaReviewRepository extends ReviewRepository, JpaRepository<Review, UUID> {

}
