package marchtue.reuse.trade.domain.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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

  private PostStateEnum postState;

  private long price;

  private long count;

  @ManyToOne
  @JoinColumn(name = "category_id")
  private Category category;

  @OneToMany(mappedBy = "post", cascade = CascadeType.ALL)
  private List<PostImage> postImages = new ArrayList<>();

  @OneToMany(mappedBy = "post")
  private List<Proposal> proposals = new ArrayList<>();

  public static Post create(
      String title,
      String content,
      boolean isParcel,
      boolean isDirect,
      String directAddress,
      ProductStateEnum productStateEnum,
      long price,
      Category category,
      List<PostImage> postImages
  ) {
    return new Post().builder()
        .title(title)
        .content(content)
        .isParcel(isParcel)
        .isDirect(isDirect)
        .directAddress(directAddress)
        .productState(productStateEnum)
        .postState(PostStateEnum.IN_PROGRESS)
        .price(price)
        .count(0L)
        .category(category)
        .postImages(postImages)
        .build();
  }
}
