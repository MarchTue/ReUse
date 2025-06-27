package marchtue.reuse.trade.domain.enums;

public enum ProductStateEnum {


  HIGHEST("최상"),
  HIGH("상"),
  UPPER_HIGH("중상"),
  MID("중"),
  LOWER_MID("중하"),
  LOW("하");

  private final String koreanState;

  ProductStateEnum(String koreanState) {
    this.koreanState = koreanState;
  }

  public String getKoreanState() {
    return koreanState;
  }
}
