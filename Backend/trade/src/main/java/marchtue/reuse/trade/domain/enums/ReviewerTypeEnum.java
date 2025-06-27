package marchtue.reuse.trade.domain.enums;

public enum ReviewerTypeEnum {

  BUYER("구매자"),
  SELLER("판매자");


  private final String typeName;

  ReviewerTypeEnum(String typeName) {
    this.typeName = typeName;
  }

  public String getTypeName() {
    return typeName;
  }
}
