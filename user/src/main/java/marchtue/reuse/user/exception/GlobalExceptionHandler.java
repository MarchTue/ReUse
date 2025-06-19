package marchtue.reuse.user.exception;

import marchtue.reuse.user.global.dto.ErrorResponse;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(BusinessException.class)
  public ResponseEntity<ErrorResponse> handleBusinessException(BusinessException ex) {
    ErrorResponse errorResponse = new ErrorResponse(ex.getCode(), ex.getMessage());
    return new ResponseEntity<>(errorResponse, HttpStatusCode.valueOf(ex.getCode()));
  }

}
