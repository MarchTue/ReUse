package marchtue.reuse.trade.domain.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import marchtue.reuse.trade.domain.enums.TradeStateEnum;
import marchtue.reuse.trade.domain.enums.TradeTypeEnum;
import marchtue.reuse.trade.global.common.BaseEntity;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "trades")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class Trade extends BaseEntity {

  @Id
  @GeneratedValue
  @UuidGenerator
  private UUID id;

  private TradeTypeEnum type;

  private TradeStateEnum state;

  private LocalDateTime completedAt;

  private String tradeTxHash;

  private String reason;

  @OneToOne
  @JoinColumn(name = "proposal_id", nullable = false)
  private Proposal proposal;
}
