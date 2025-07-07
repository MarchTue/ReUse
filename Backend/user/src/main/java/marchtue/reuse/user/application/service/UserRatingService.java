package marchtue.reuse.user.application.service;

import java.util.UUID;
import lombok.RequiredArgsConstructor;
import marchtue.reuse.user.domain.model.UserRating;
import marchtue.reuse.user.domain.repository.UserRatingRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserRatingService {

  private final UserRatingRepository userRatingRepository;

  public UserRating findByUserId(UUID userId) {
    return userRatingRepository.findByUserId(userId);
  }
}
