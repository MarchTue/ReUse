package marchtue.reuse.trade.domain.enums;

public enum DealTypeEnum {

  PARCEL("택배"),
  DIRECT("직거래");

  private String koreanState;

  DealTypeEnum(String koreanState) {
    this.koreanState = koreanState;
  }

  public String getKoreanState() {
    return koreanState;
  }
}
