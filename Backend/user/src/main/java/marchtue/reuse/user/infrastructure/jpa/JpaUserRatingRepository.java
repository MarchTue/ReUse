package marchtue.reuse.user.infrastructure.jpa;

import java.util.UUID;
import marchtue.reuse.user.domain.model.UserRating;
import marchtue.reuse.user.domain.repository.UserRatingRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaUserRatingRepository extends UserRatingRepository,
    JpaRepository<UserRating, UUID> {

}
