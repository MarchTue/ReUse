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
import marchtue.reuse.user.global.common.BaseEntityNonUpdated;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "credentials")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class Credential extends BaseEntityNonUpdated {

  @Id
  @GeneratedValue
  @UuidGenerator
  private UUID id;

  @Column(length = 100)
  private String did;

  @ManyToOne
  @JoinColumn(name = "user_id")
  private User user;

  public static Credential create(
      String did,
      User user
  ) {
    Credential credential = Credential.builder()
        .did(did)
        .user(user)
        .build();
    credential.setCreatedBy(user.getId());
    return credential;
  }

}
