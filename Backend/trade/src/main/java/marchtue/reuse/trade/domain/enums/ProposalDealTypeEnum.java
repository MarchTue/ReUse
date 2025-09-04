package marchtue.reuse.trade.domain.enums;

public enum ProposalDealTypeEnum {

  PARCEL("택배"),
  DIRECT("직거래");

  private String koreanState;

  ProposalDealTypeEnum(String koreanState) {
    this.koreanState = koreanState;
  }

  public String getKoreanState() {
    return koreanState;
  }
}
