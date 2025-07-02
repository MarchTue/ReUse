package marchtue.reuse.user.domain.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "user_categories", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "category_id"})
})
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class UserCategory {

  @Id
  @GeneratedValue
  @UuidGenerator
  private UUID id;

  @Column(name = "user_id", nullable = false, columnDefinition = "UUID")
  private UUID userId;

  @Column(name = "category_id", nullable = false, columnDefinition = "UUID")
  private UUID categoryId;

  public static UserCategory create(
      UUID userId,
      UUID categoryId
  ) {
    return UserCategory.builder()
        .userId(userId)
        .categoryId(categoryId)
        .build();
  }
}
