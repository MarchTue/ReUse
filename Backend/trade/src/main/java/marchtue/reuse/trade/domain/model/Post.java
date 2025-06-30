package marchtue.reuse.trade.domain.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import marchtue.reuse.trade.domain.enums.PostStateEnum;
import marchtue.reuse.trade.domain.enums.ProductStateEnum;
import marchtue.reuse.trade.global.common.BaseEntity;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "posts")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class Post extends BaseEntity {

  @Id
  @GeneratedValue
  @UuidGenerator
  private UUID id;

  @NotNull
  private String title;

  @Column(columnDefinition = "TEXT")
  private String content;

  private Boolean isParcel;

  private Boolean isDirect;

  private String directAddress;

  private ProductStateEnum productState;

  private PostStateEnum tradeState;

  private long price;

  private long count;

  // 카테고리 Id 추가 필요

  @OneToMany(mappedBy = "post", cascade = CascadeType.ALL)
  private List<PostImage> postImages = new ArrayList<>();
}
