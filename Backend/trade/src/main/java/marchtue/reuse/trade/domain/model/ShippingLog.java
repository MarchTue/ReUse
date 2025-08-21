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
import marchtue.reuse.trade.domain.enums.CourierCompany;
import marchtue.reuse.trade.global.common.BaseEntityNonUpdated;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "shipping_logs")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class ShippingLog extends BaseEntityNonUpdated {

  @Id
  @GeneratedValue
  @UuidGenerator
  private UUID id;

  private CourierCompany courierName;

  private String trackingNumber;

  private String place;

  private String shippingState;

  private String eventTxHash;

  @ManyToOne
  @JoinColumn(name = "deal_id")
  private Deal deal;

}
