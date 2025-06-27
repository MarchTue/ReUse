package marchtue.reuse.trade.domain.enums;

public enum PostStateEnum {

  IN_PROGRESS("거래전"),
  TRADING("거래중"),
  DONE("거래완료");

  private String koreanState;

  PostStateEnum(String koreanState) {
    this.koreanState = koreanState;
  }

  public String getKoreanState() {
    return koreanState;
  }
}
