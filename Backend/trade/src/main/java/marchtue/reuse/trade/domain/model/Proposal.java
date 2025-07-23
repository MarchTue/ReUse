package marchtue.reuse.trade.domain.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import marchtue.reuse.trade.domain.enums.ProposalStateEnum;
import marchtue.reuse.trade.domain.enums.ProposalTradeTypeEnum;
import marchtue.reuse.trade.global.common.BaseEntityNonUpdated;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "proposals")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class Proposal extends BaseEntityNonUpdated {

  @Id
  @GeneratedValue
  @UuidGenerator
  private UUID id;

  private ProposalTradeTypeEnum type;

  private long price;

  private String address;

  private ProposalStateEnum state;

  @ManyToOne
  @JoinColumn(name = "post_id")
  private Post post;

  @OneToOne(mappedBy = "proposal")
  private Trade trade;

  public static Proposal create(
      ProposalTradeTypeEnum type,
      long price,
      String address,
      ProposalStateEnum state,
      Post post
  ) {
    return new Proposal().builder()
        .type(type)
        .price(price)
        .address(address)
        .state(state)
        .post(post)
        .build();
  }

  public void acceptProposal(
  ) {
    this.state = ProposalStateEnum.ACCEPTED;
  }

  public void cancelProposal(
  ) {
    this.state = ProposalStateEnum.CANCLED;
  }

  public void rejectProposal(
  ) {
    this.state = ProposalStateEnum.REJECTED;
  }
}
