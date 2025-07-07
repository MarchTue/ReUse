package marchtue.reuse.user.infrastructure.jpa;

import java.util.UUID;
import marchtue.reuse.user.domain.model.Wallet;
import marchtue.reuse.user.domain.repository.WalletRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaWalletRepository extends WalletRepository, JpaRepository<Wallet, UUID> {

}
