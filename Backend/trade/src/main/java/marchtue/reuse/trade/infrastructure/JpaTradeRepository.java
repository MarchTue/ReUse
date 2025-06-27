package marchtue.reuse.trade.infrastructure;

import java.util.UUID;
import marchtue.reuse.trade.domain.repository.TradeRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaTradeRepository extends TradeRepository, JpaRepository<TradeRepository, UUID> {

}
