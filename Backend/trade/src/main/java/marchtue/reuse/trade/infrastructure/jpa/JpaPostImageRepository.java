package marchtue.reuse.trade.infrastructure.jpa;

import java.util.UUID;
import marchtue.reuse.trade.domain.model.PostImage;
import marchtue.reuse.trade.domain.repository.PostImageRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaPostImageRepository extends PostImageRepository,
    JpaRepository<PostImage, UUID> {

}
