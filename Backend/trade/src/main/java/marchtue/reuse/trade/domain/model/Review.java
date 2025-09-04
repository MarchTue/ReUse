package marchtue.reuse.trade.domain.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import marchtue.reuse.trade.domain.enums.ReviewerTypeEnum;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "reviews")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class Review {

  @Id
  @GeneratedValue
  @UuidGenerator
  private UUID id;

  private int point;

  private String comment;

  private UUID userId;

  private ReviewerTypeEnum reviewerType;

  @OneToOne
  @JoinColumn(name = "deal_id", nullable = false)
  private Deal deal;
}
