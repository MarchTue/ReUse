package marchtue.reuse.trade.global.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ApiResponse<T>(
    int code,
    String msg,
    T data
) {

  public static <T> ApiResponse<T> ok(T data) {
    return new ApiResponse<>(200, "succeeded", data);
  }

  public static ApiResponse<Void> ok() {
    return new ApiResponse<>(200, "succeeded", null);
  }

  public static <T> ApiResponse<T> of(int code, String msg, T data) {
    return new ApiResponse<>(code, msg, data);
  }

  public static ApiResponse<Void> error(int code, String msg) {
    return new ApiResponse<>(code, msg, null);
  }
}
