package marchtue.reuse.trade.domain.repository;

import java.util.Optional;
import java.util.UUID;
import marchtue.reuse.trade.domain.enums.ProposalStateEnum;
import marchtue.reuse.trade.domain.model.Proposal;

public interface ProposalRepository {

  Proposal findByPostIdAndState(UUID postId, ProposalStateEnum proposalStateEnum);

  Proposal save(Proposal proposal);

  Optional<Proposal> findById(UUID proposalId);
}
