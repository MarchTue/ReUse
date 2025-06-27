package marchtue.reuse.trade.domain.enums;

public enum ProposalStateEnum {

  WAIT("대기중"),
  ACCEPTED("수락"),
  REJECTED("거절"),
  CANCLED("취소");

  private String koreanState;

  ProposalStateEnum(String koreanState) {
    this.koreanState = koreanState;
  }

  public String getKoreanState() {
    return koreanState;
  }
}
