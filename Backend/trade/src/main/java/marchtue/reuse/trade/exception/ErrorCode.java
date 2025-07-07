package marchtue.reuse.trade.exception;

import lombok.Getter;

@Getter
public enum ErrorCode {

  FORBIDDEN(403, "forbidden"),
  NO_ROLE(400, "theres no role"),
  Duplicated(400, "already exist"),
  NOT_FOUND(404, "not found"),
  TRADE_WAY_ERROR(400, "parcel/direct error"),
  DIRECT_ADDRESS(400, "direct address is null");

  private final int code;
  private final String message;

  ErrorCode(int code, String message) {
    this.code = code;
    this.message = message;
  }
}
