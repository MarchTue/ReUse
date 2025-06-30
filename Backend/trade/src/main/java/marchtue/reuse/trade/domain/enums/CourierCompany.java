package marchtue.reuse.trade.domain.enums;

public enum CourierCompany {
  CJ_LOGISTICS("CJ대한통운"),
  LOTTE("롯데택배"),
  HANA("한진택배"),
  POST_OFFICE("우체국택배"),
  CU("CU편의점택배"),
  GS("GS25편의점택배"),
  LOGEN("로젠택배"),
  KDEXP("경동택배"),
  ILYANG("일양로지스"),
  DHL("DHL"),
  FEDEX("FedEx"),
  UPS("UPS"),
  AMAZON("아마존직배"),
  SFEXPRESS("순펑택배");

  private final String displayName;

  CourierCompany(String displayName) {
    this.displayName = displayName;
  }

  public String getDisplayName() {
    return displayName;
  }
}