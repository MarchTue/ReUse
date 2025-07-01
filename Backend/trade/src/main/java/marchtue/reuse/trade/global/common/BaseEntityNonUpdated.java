package marchtue.reuse.trade.global.common;

import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.Getter;
import marchtue.reuse.trade.global.util.RequestUtil;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@EntityListeners(AuditingEntityListener.class)
@Getter
@MappedSuperclass
public abstract class BaseEntityNonUpdated {


  @Column(name = "created_by", nullable = false, length = 100)
  private UUID createdBy;

  @Column(name = "deleted_by", length = 100)
  private UUID deletedBy;

  @CreationTimestamp
  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @Column(name = "deleted_at")
  private LocalDateTime deletedAt;

  @Column(name = "is_deleted", nullable = false)
  @ColumnDefault("false")
  private boolean isDeleted;

  @PrePersist
  public void createBase() {
    this.createdAt = LocalDateTime.now();
    this.createdBy = RequestUtil.getCurrentUserId();
  }

  public void deleteBase() {
    this.isDeleted = true;
    this.deletedAt = LocalDateTime.now();
    this.deletedBy = RequestUtil.getCurrentUserId();
  }
}
