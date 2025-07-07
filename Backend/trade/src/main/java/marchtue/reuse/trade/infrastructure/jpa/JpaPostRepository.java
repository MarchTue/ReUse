package marchtue.reuse.trade.infrastructure.jpa;

import java.util.UUID;
import marchtue.reuse.trade.domain.model.Post;
import marchtue.reuse.trade.domain.repository.PostRepository;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JpaPostRepository extends PostRepository, JpaRepository<Post, UUID> {

}
