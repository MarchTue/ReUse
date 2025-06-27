package marchtue.reuse.trade.domain.model;

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
import marchtue.reuse.trade.global.common.BaseEntityNonUpdated;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "post_images")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class PostImage extends BaseEntityNonUpdated {

  @Id
  @GeneratedValue
  @UuidGenerator
  private UUID id;

  private String imageLink;

  @ManyToOne
  @JoinColumn(name = "post_id")
  private Post post;

}
