package marchtue.reuse.user.domain.enums;

public enum DidTypeEnum {

  RESIDENT("주민등록증"),
  DRIVER("운전면허증");

  private final String koreanName;

  DidTypeEnum(String koreanName) {
    this.koreanName = koreanName;
  }

  public String getKoreanName() {
    return koreanName;
  }


}
