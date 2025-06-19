package marchtue.reuse.user.domain.enums;

public enum EWalletTypeEnum {

  KAKAOPAY("카카오페이"),
  TOSSPAY("토스페이"),
  NAVERPAY("네이버페이"),
  PAYCO("페이코"),
  SAMSUNGPAY("삼성페이"),
  APPLEPAY("애플페이"),
  GOOGLEPAY("구글페이");

  private final String displayName;

  EWalletTypeEnum(String displayName) {
    this.displayName = displayName;
  }

  public String getDisplayName() {
    return displayName;
  }
}
