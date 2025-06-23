package marchtue.reuse.auth.domain.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "user_sessions")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class UserSession {

  @Id
  @GeneratedValue
  @UuidGenerator
  @Column(updatable = false, nullable = false)
  private UUID id;

  @Column(updatable = false, nullable = false)
  private String deviceId;

  @Column(updatable = false, nullable = false)
  private String userAgent;

  @Column(updatable = false)
  private String platform;

  @CreationTimestamp
  @Column(name = "login_at", nullable = false, updatable = false)
  private LocalDateTime loginAt;

  @ColumnDefault("false")
  private boolean isDeleted;

  private UUID userId;


  public UserSession create(
      String deviceId,
      String userAgent,
      String platform,
      LocalDateTime loginAt,
      UUID userId
  ){
    return UserSession.builder()
        .deviceId(deviceId)
        .userAgent(userAgent)
        .platform(platform)
        .loginAt(loginAt)
        .isDeleted(false)
        .userId(userId)
        .build();
  }


}
