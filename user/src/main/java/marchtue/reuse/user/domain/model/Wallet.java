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
import marchtue.reuse.user.domain.enums.EWalletPlatformEnum;
import marchtue.reuse.user.domain.enums.EWalletTypeEnum;
import marchtue.reuse.user.global.common.BaseEntity;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "wallets")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class Wallet extends BaseEntity {

  @Id
  @GeneratedValue
  @UuidGenerator
  @Column(updatable = false, nullable = false)
  private UUID id;

  private String address;

  private EWalletTypeEnum type;

  private EWalletPlatformEnum platform;

  @ManyToOne
  @JoinColumn(name = "user_id")
  private User user;

}
