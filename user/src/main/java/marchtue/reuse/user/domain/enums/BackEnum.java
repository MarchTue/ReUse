package marchtue.reuse.user.domain.enums;

public enum BackEnum {

  KAKAO_BANK("카카오뱅크"),
  TOSS_BANK("토스뱅크"),
  KB_BANK("국민은행"),
  SHINHAN_BANK("신한은행"),
  HANA_BANK("하나은행"),
  WOORI_BANK("우리은행"),
  NH_BANK("농협은행"),
  IBK_BANK("기업은행"),
  K_BANK("케이뱅크"),
  CITY_BANK("한국씨티은행"),
  SC_BANK("SC제일은행"),
  DGB_BANK("대구은행"),
  BNK_BUSAN("부산은행"),
  BNK_KYONGNAM("경남은행"),
  JEONBUK_BANK("전북은행"),
  JEJU_BANK("제주은행"),
  SH_BANK("수협은행");

  private final String koreanName;

  BackEnum(String koreanName) {
    this.koreanName = koreanName;
  }

  public String getKoreanName() {
    return koreanName;
  }
}
