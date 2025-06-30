package marchtue.reuse.trade.domain.enums;

public enum TradeTypeEnum {

  PARCEL("택배"),
  DIRECT("직거래");

  private String koreanState;

  TradeTypeEnum(String koreanState) {
    this.koreanState = koreanState;
  }

  public String getKoreanState() {
    return koreanState;
  }
}
