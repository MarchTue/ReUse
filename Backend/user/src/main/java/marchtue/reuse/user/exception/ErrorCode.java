package marchtue.reuse.user.exception;

import lombok.Getter;

@Getter
public enum ErrorCode {

  INVALID_NICKNAME(400, "invalid nickname"),
  BADWORD_NICKNAME(400, "bad word nickname"),
  DUPLICATED_NICKNAME(400, "duplicated nickname"),
  USER_NOT_FOUND(404, "user not found");


  private final int code;
  private final String message;

  ErrorCode(int code, String message) {
    this.code = code;
    this.message = message;
  }
}
