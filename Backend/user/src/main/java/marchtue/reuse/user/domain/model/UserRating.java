package marchtue.reuse.user.domain.model;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import marchtue.reuse.user.global.common.BaseEntity;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "user_ratings")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class UserRating extends BaseEntity {

  @Id
  @GeneratedValue
  @UuidGenerator
  private UUID id;

  @Builder.Default
  private Long inProgressTrade = 0L;

  @Builder.Default
  private Long completedTrade = 0L;

  @Builder.Default
  private BigDecimal totalScore = BigDecimal.ZERO;

  @Builder.Default
  private BigDecimal rateScore = BigDecimal.ZERO;

  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id")
  private User user;

}
