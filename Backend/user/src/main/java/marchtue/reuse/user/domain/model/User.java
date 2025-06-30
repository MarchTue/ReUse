package marchtue.reuse.user.domain.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
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
import marchtue.reuse.user.domain.enums.BankEnum;
import marchtue.reuse.user.domain.enums.UserRoleEnum;
import marchtue.reuse.user.global.common.BaseEntity;

@Entity
@Table(name = "user_infos")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class User extends BaseEntity {

  @Id
  @Column(updatable = false, nullable = false)
  private UUID id;

  @Column(updatable = false, nullable = false)
  private String ciHs;

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
  private BankEnum bank;

  @Column(length = 30)
  private String account;

  @Min(0)
  private Long token;

  @Min(0)
  private Integer reportedCnt;

  @Builder.Default
  @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<RecentWord> recentWords = new ArrayList<>();

  @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private UserRating userRating;

  public static User create(
      String ciHs,
      String username,
      String phoneNumber,
      String nickname,
      String profileImage
  ) {
    UUID generatedId = UUID.randomUUID();

    User user = User.builder()
        .id(generatedId)
        .ciHs(ciHs)
        .username(username)
        .phoneNumber(phoneNumber)
        .nickname(nickname)
        .profileImage(profileImage)
        .role(UserRoleEnum.ROLE_USER)
        .token(0L)
        .reportedCnt(0)
        .build();

    user.setCreatedBy(generatedId);
    return user;
  }

  public User addBank(
      User user,
      BankEnum bank,
      String account
  ) {
    user.bank = bank;
    user.account = account;
    return user;
  }
}
