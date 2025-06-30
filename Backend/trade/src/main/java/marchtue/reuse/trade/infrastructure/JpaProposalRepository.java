package marchtue.reuse.trade.infrastructure;

import java.util.UUID;
import marchtue.reuse.trade.domain.model.Proposal;
import marchtue.reuse.trade.domain.repository.ProposalRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaProposalRepository extends ProposalRepository, JpaRepository<Proposal, UUID> {

}
