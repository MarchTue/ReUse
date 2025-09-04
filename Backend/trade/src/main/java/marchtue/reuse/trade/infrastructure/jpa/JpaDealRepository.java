package marchtue.reuse.trade.infrastructure.jpa;

import java.util.UUID;
import marchtue.reuse.trade.domain.model.Deal;
import marchtue.reuse.trade.domain.repository.DealRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaDealRepository extends DealRepository, JpaRepository<Deal, UUID> {

}
