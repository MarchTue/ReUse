package marchtue.reuse.trade.domain.enums;

public enum DealStateEnum {

  PENDING("대기중"), //직거래시
  IN_DELIVERY("배송중"),
  DELIVERED("배송완료"),
  CANCLED("취소"),
  COMPLETED("거래완료");

  private String koreanState;

  DealStateEnum(String koreanState) {
    this.koreanState = koreanState;
  }

  public String getKoreanState() {
    return koreanState;
  }
}
