package marchtue.reuse.trade.infrastructure.jpa;

import java.util.UUID;
import marchtue.reuse.trade.domain.model.ShippingLog;
import marchtue.reuse.trade.domain.repository.ShippingLogRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaShippingLogRepository extends ShippingLogRepository,
    JpaRepository<ShippingLog, UUID> {

}
