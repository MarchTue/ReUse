package marchtue.reuse.user.domain.repository;

import java.util.UUID;
import marchtue.reuse.user.domain.model.UserRating;

public interface UserRatingRepository {

  UserRating save(UserRating rating);

  UserRating findByUserId(UUID id);
}
