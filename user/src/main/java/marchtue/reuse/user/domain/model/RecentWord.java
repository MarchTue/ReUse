package marchtue.reuse.user.domain.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "recent_words", schema = "user")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class RecentWord {


  @Id
  @GeneratedValue
  @UuidGenerator
  @Column(updatable = false, nullable = false)
  private UUID recentWordId;

  @Column(length = 20)
  private String keyword;

  @ManyToOne
  @JoinColumn(name = "user_id")
  private User user;
}
