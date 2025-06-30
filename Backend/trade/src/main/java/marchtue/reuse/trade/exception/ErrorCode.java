package marchtue.reuse.trade.exception;

import lombok.Getter;

@Getter
public enum ErrorCode {

  FORBIDDEN(403, "fobidden"),
  NO_ROLE(400, "theres no role");


  private final int code;
  private final String message;

  ErrorCode(int code, String message) {
    this.code = code;
    this.message = message;
  }
}
