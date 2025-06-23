package marchtue.reuse.user.domain.enums;

public enum EWalletPlatformEnum {


  KAKAOPAY("카카오페이", true, true, true),
  TOSSPAY("토스페이", true, true, true),
  NAVERPAY("네이버페이", true, true, true),
  PAYCO("페이코", true, true, true),
  SAMSUNGPAY("삼성페이", true, false, false),
  APPLEPAY("애플페이", true, false, true),
  GOOGLEPAY("구글페이", true, true, false);

  private final String displayName;
  private final boolean mobileSupported;
  private final boolean androidSupported;
  private final boolean iosSupported;

  EWalletPlatformEnum(String displayName, boolean mobileSupported, boolean androidSupported,
      boolean iosSupported) {
    this.displayName = displayName;
    this.mobileSupported = mobileSupported;
    this.androidSupported = androidSupported;
    this.iosSupported = iosSupported;
  }

  public String getDisplayName() {
    return displayName;
  }

  public boolean isMobileSupported() {
    return mobileSupported;
  }

  public boolean isAndroidSupported() {
    return androidSupported;
  }

  public boolean isIosSupported() {
    return iosSupported;
  }
}
