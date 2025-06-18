package marchtue.reuse.user.domain.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import marchtue.reuse.user.domain.enums.BackEnum;
import marchtue.reuse.user.domain.enums.UserRoleEnum;
import marchtue.reuse.user.global.common.BaseEntity;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "users", schema = "user")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class User extends BaseEntity {

  @Id
  @GeneratedValue
  @UuidGenerator
  @Column(updatable = false, nullable = false)
  private UUID id;

  @Column(updatable = false, nullable = false)
  private String uniqueCre;

  @Column(length = 20)
  private String username;

  @Column(length = 20)
  private String phoneNumber;

  @Column(length = 20)
  private String nickname;

  private String profileImage;

  @Column(length = 20)
  private UserRoleEnum role;

  @Column(length = 20)
  private BackEnum bank;

  @Column(length = 30)
  private String account;

  @Min(0)
  private Long token = 0L;

  @Min(0)
  private Integer reportedCnt = 0;

  @OneToMany(mappedBy = "RECENT_WORDS", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<RecentWord> recentWords = new ArrayList<>();

  @OneToOne(mappedBy = "USERS", cascade = CascadeType.ALL, fetch = FetchType.LAZY, optional = false)
  private UserRating userRating;

}
